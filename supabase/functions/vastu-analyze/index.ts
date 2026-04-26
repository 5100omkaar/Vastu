import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY"), {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY secret is not set in Supabase");

    const { imageUrl, question } = await req.json();
    if (!imageUrl) throw new Error("imageUrl is required");

    console.log("Vastu analysis for user: " + user.id);

    // Fetch the image to pass as inline base64 to ensure reliable Gemini processing
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error("Failed to fetch image: " + imageResponse.status);

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const mimeType = contentType.split(";")[0].trim();

    const buffer = await imageResponse.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const imageBase64 = btoa(binary);
    console.log("Image encoded, size: " + bytes.length);

    const prompt = "You are VastuVista AI, an expert Vastu Shastra consultant. Analyze the floor plan image.\n\n"
      + "Analyze: room placement vs cardinal directions, entrance facing, kitchen (SE/fire), bathroom (N or NW/water), bedroom (SW), pooja room (NE), staircase, door alignments, elemental balance."
      + (question ? "\nAdditional question: " + question : "");

    const response = await fetch(`${GEMINI_URL}?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              overall_score: { type: "INTEGER" },
              summary: { type: "STRING" },
              room_scores: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    room: { type: "STRING" },
                    score: { type: "INTEGER" },
                    direction: { type: "STRING" },
                    element: { type: "STRING" },
                    status: { type: "STRING" }
                  }
                }
              },
              recommendations: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    priority: { type: "STRING" },
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    room: { type: "STRING" }
                  }
                }
              },
              element_harmony: {
                type: "OBJECT",
                properties: {
                  fire: { type: "INTEGER" },
                  water: { type: "INTEGER" },
                  earth: { type: "INTEGER" },
                  air: { type: "INTEGER" },
                  space: { type: "INTEGER" }
                }
              }
            }
          }
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error("Gemini API error: " + response.status + " " + err.slice(0, 200));
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error("No response from Gemini");

    console.log("Gemini responded successfully");
    
    // Direct parse since responseMimeType is application/json
    const reportData = JSON.parse(responseText);

    if (!reportData.overall_score || !reportData.summary || !reportData.room_scores ||
      !reportData.recommendations || !reportData.element_harmony) {
      throw new Error("AI response missing required fields");
    }

    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const { data: report, error: insertError } = await serviceClient
      .from("reports")
      .insert({ user_id: user.id, image_url: imageUrl, report_data: reportData, overall_score: reportData.overall_score })
      .select()
      .single();

    if (insertError) throw new Error("Failed to save report: " + insertError.message);

    console.log("Report saved: " + report.id);
    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("vastu-analyze error: " + message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
