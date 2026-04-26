import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, Loader2, Bot, User, Sparkles, Volume2, VolumeX, History, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/vastuvista-logo.png";
import SEOHead from "@/components/SEOHead";

type MessageRole = "user" | "assistant";
type MessageType = "text" | "image";

interface ChatMessage {
  role: MessageRole;
  content: string;
  type: MessageType;
  images?: { url: string }[];
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: string;
  created_at: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

// Detect if the user wants an image generated
const IMAGE_KEYWORDS = /\b(generate|create|draw|make|design|show|paint|render|illustrate|produce)\b.{0,40}\b(image|picture|photo|illustration|visual|diagram|floor\s*plan|layout|sketch)\b/i;
const isImageRequest = (text: string) => IMAGE_KEYWORDS.test(text);

const Assistant = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) loadChatHistories();
  }, [user]);

  // Auto-send question from URL param (e.g. from homepage QuestionInput)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && user && !loading) {
      const timer = setTimeout(() => {
        const userMsg: ChatMessage = { role: "user", content: q, type: "text" };
        setMessages([userMsg]);
        setIsLoading(true);
        streamChat([{ role: "user", content: q }])
          .then(() => setMessages((prev) => { saveChatHistory(prev); return prev; }))
          .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
          .finally(() => setIsLoading(false));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, loading, searchParams]);

  const loadChatHistories = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_histories")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(20);
    if (data) setChatHistories(data as unknown as ChatHistory[]);
  };

  const saveChatHistory = useCallback(async (msgs: ChatMessage[]) => {
    if (!user || msgs.length === 0) return;
    const title = msgs[0]?.content?.slice(0, 50) || "New Chat";
    if (currentChatId) {
      await supabase
        .from("chat_histories")
        .update({ messages: msgs as any, updated_at: new Date().toISOString() })
        .eq("id", currentChatId);
    } else {
      const { data } = await supabase
        .from("chat_histories")
        .insert({ user_id: user.id, title, messages: msgs as any, mode: "chat" })
        .select()
        .single();
      if (data) setCurrentChatId(data.id);
    }
    loadChatHistories();
  }, [user, currentChatId]);

  const speakText = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const streamChat = async (allMessages: { role: string; content: string }[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages, mode: "chat" }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      if (resp.status === 429) { toast({ title: "Rate limit", description: "Too many requests. Please wait a moment.", variant: "destructive" }); return; }
      throw new Error(err.error || "Failed to get response");
    }

    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") return;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && last.type === "text") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
              }
              return [...prev, { role: "assistant", content: assistantContent, type: "text" }];
            });
          }
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    if (assistantContent) speakText(assistantContent);
  };

  const generateImage = async (prompt: string) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], mode: "image" }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      if (resp.status === 429) { toast({ title: "Rate limit", description: "Image quota exceeded. Try again in a minute.", variant: "destructive" }); return null; }
      throw new Error(err.error || "Failed to generate image");
    }
    return await resp.json();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const wantsImage = isImageRequest(text);
    const userMsg: ChatMessage = { role: "user", content: text, type: wantsImage ? "image" : "text" };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      if (wantsImage) {
        const data = await generateImage(text);
        if (data) {
          const images = data.images?.map((img: any) => ({ url: img.url || img.image_url?.url })) || [];
          const finalMessages = [
            ...newMessages,
            { role: "assistant" as const, content: data.text || "Here is your generated image:", type: "image" as const, images },
          ];
          setMessages(finalMessages);
          saveChatHistory(finalMessages);
        }
      } else {
        const apiMessages = newMessages
          .filter((m) => m.type === "text")
          .map((m) => ({ role: m.role, content: m.content }));
        await streamChat(apiMessages);
        setMessages((prev) => { saveChatHistory(prev); return prev; });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const loadChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowHistory(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setShowHistory(false);
  };

  const deleteChat = async (chatId: string) => {
    await supabase.from("chat_histories").delete().eq("id", chatId);
    setChatHistories((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) startNewChat();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="AI Assistant — VastuVista" description="Chat with VastuVista's AI assistant for Vastu guidance and image generation." path="/assistant" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <img src={logo} alt="VastuVista" className="h-7 w-7" />
              <h1 className="font-display text-lg font-bold text-foreground">AI Assistant</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) window.speechSynthesis?.cancel(); }}
              className={`p-2 rounded-lg border border-border transition-colors ${ttsEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              title={ttsEnabled ? "Disable voice" : "Enable voice"}
            >
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadChatHistories(); }}
              className={`p-2 rounded-lg border border-border transition-colors ${showHistory ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
            >
              <History className="h-4 w-4" />
            </button>
            <button
              onClick={startNewChat}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border bg-card overflow-y-auto shrink-0"
            >
              <div className="p-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Chat History</p>
                {chatHistories.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-4">No previous chats</p>
                ) : (
                  chatHistories.map((chat) => (
                    <div key={chat.id} className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors ${currentChatId === chat.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                      <button onClick={() => loadChat(chat)} className="flex-1 text-left truncate text-xs">{chat.title}</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Ask anything about Vastu Shastra or say "generate an image of..." to create visuals.
                </p>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {[
                    "Best Vastu tips for a new home",
                    "Ideal kitchen direction",
                    "Generate an image of a Vastu-compliant floor plan",
                    "How to energize my living room",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border text-card-foreground rounded-bl-md"}`}>
                    {msg.type === "image" && msg.images && msg.images.length > 0 ? (
                      <div className="space-y-2">
                        {msg.content && <p className="mb-2">{msg.content}</p>}
                        {msg.images.map((img, idx) => (
                          <img key={idx} src={img.url} alt="AI Generated" className="rounded-lg max-w-full" />
                        ))}
                      </div>
                    ) : msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center mt-1">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask about Vastu, or say "generate an image of..."'
              className="min-h-[44px] max-h-[120px] resize-none rounded-xl"
              rows={1}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="h-11 w-11 rounded-xl shrink-0">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            AI responses may not always be accurate. Say "generate an image of..." to create visuals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
