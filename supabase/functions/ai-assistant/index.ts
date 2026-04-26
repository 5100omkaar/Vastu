import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
const GEMINI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const HF_MODEL = Deno.env.get("HF_MODEL") || "black-forest-labs/FLUX.1-schnell";
const HF_IMAGE_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY secret is not set in Supabase");

    const { messages, mode } = await req.json();
    const isImageMode = mode === "image";

    console.log("AI Assistant - mode: " + mode + ", messages: " + messages?.length);

    // IMAGE GENERATION MODE — Hugging Face FLUX.1-schnell (free)
    if (isImageMode) {
      const HF_API_KEY = Deno.env.get("HF_API_KEY");
      if (!HF_API_KEY) throw new Error("HF_API_KEY secret is not set in Supabase");

      const prompt = messages?.[messages.length - 1]?.content || "";
      if (!prompt) throw new Error("No prompt provided for image generation");

      console.log("Generating image with FLUX.1-schnell, prompt: " + prompt);

      const response = await fetch(HF_IMAGE_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + HF_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt, parameters: { num_inference_steps: 4 } }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("HF error " + response.status + ": " + err);
        if (response.status === 503) throw new Error("Image model is loading, please try again in 20 seconds.");
        if (response.status === 429) throw new Error("Image generation quota exceeded. Please try again shortly.");
        throw new Error("Image generation failed: " + response.status);
      }

      const imageBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(imageBuffer);
      // Chunked conversion to avoid call stack overflow on large images
      let binary = "";
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      const base64 = btoa(binary);

      console.log("Image generated, size: " + bytes.length + " bytes");

      return new Response(
        JSON.stringify({
          text: "Here is your generated image:",
          images: [{ url: "data:image/jpeg;base64," + base64 }],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CHAT MODE — Gemini 2.5 Flash
    const systemPrompt = "You are VastuVista AI Assistant, a knowledgeable friendly assistant specializing in Vastu Shastra, architecture, and home design. Format responses with markdown when appropriate.";

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am ready to help with Vastu Shastra and home design." }] },
    ];

    for (const msg of messages) {
      const role = msg.role === "assistant" ? "model" : "user";
      const text = typeof msg.content === "string"
        ? msg.content
        : Array.isArray(msg.content)
          ? msg.content.map((p) => p.text || "").join(" ")
          : "";
      if (text) contents.push({ role, parts: [{ text }] });
    }

    const response = await fetch(GEMINI_TEXT_URL + "?key=" + GOOGLE_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error " + response.status + ": " + err);
      throw new Error("Gemini API error: " + response.status);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error("No response from Gemini");

    console.log("Gemini responded, length: " + responseText.length);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: " + JSON.stringify({ choices: [{ delta: { content: responseText } }] }) + "\n\n"));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });

  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("AI Assistant error: " + message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
