import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { messages } = body;

        // Check for API key
        const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");

        console.log("=== DEBUG INFO ===");
        console.log("All env vars:", Object.keys(Deno.env.toObject()));
        console.log("GOOGLE_API_KEY exists:", !!GOOGLE_API_KEY);
        console.log("GOOGLE_API_KEY length:", GOOGLE_API_KEY?.length || 0);

        if (!GOOGLE_API_KEY) {
            throw new Error("GOOGLE_API_KEY is not configured. Please add it to Supabase Edge Functions secrets.");
        }

        // Build request
        const geminiContents = [
            { role: "user", parts: [{ text: "You are a Vastu expert assistant." }] },
            { role: "model", parts: [{ text: "I understand." }] }
        ];

        for (const msg of messages) {
            const role = msg.role === "assistant" ? "model" : "user";
            const text = typeof msg.content === "string" ? msg.content : "";
            if (text) {
                geminiContents.push({ role: role, parts: [{ text: text }] });
            }
        }

        console.log("Calling Gemini API...");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: geminiContents,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
                }),
            }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error("No response from AI");
        }

        console.log("Success! Response length:", responseText.length);

        // Return streaming format
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                const chunk = { choices: [{ delta: { content: responseText } }] };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                ...corsHeaders,
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache"
            },
        });

    } catch (e) {
        console.error("Error:", e);
        return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
