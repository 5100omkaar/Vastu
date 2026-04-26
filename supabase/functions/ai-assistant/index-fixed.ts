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

        const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
        if (!GOOGLE_API_KEY) {
            throw new Error("GOOGLE_API_KEY is not configured");
        }

        console.log("API key found, length:", GOOGLE_API_KEY.length);

        // Build Gemini request
        const geminiContents = [
            { role: "user", parts: [{ text: "You are VastuVista AI Assistant, a Vastu Shastra expert." }] },
            { role: "model", parts: [{ text: "I understand. I'm ready to help!" }] }
        ];

        for (const msg of messages) {
            const role = msg.role === "assistant" ? "model" : "user";
            const text = typeof msg.content === "string" ? msg.content : "";
            if (text) {
                geminiContents.push({ role: role, parts: [{ text: text }] });
            }
        }

        // Use the correct model name for v1beta API
        console.log("Calling Gemini API with model: gemini-pro");

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
            console.error("No response text:", JSON.stringify(data));
            throw new Error("No response from AI");
        }

        console.log("✅ Success! Response length:", responseText.length);

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
