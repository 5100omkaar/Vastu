// Test script to verify Google Gemini API key
// Run this with: node test-gemini-api.js

// ⚠️ REPLACE THIS WITH YOUR ACTUAL API KEY FROM https://aistudio.google.com/app/apikey
const GOOGLE_API_KEY = "AIzaSyBscEZjC9N83KAzAz4On_1aIj3RLfhqJPI";

async function testGeminiAPI() {
    console.log("Testing Google Gemini API...\n");

    // Check if API key was replaced
    if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE" || !GOOGLE_API_KEY) {
        console.error("❌ ERROR: You need to replace YOUR_API_KEY_HERE with your actual Google API key!");
        console.log("\nSteps to get your API key:");
        console.log("1. Go to: https://aistudio.google.com/app/apikey");
        console.log("2. Click 'Create API Key'");
        console.log("3. Copy the key (starts with AIza...)");
        console.log("4. Replace YOUR_API_KEY_HERE in this file with your key");
        console.log("5. Run this script again\n");
        return;
    }

    console.log("API Key found (length:", GOOGLE_API_KEY.length, ")");
    console.log("API Key starts with:", GOOGLE_API_KEY.substring(0, 10) + "...\n");

    // Test 1: List available models
    console.log("1. Fetching available models...");
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_API_KEY}`
        );

        if (!response.ok) {
            const error = await response.text();
            console.error("❌ Error fetching models:", response.status);
            console.error("Response:", error);

            if (response.status === 400) {
                console.log("\n💡 This usually means your API key is invalid or malformed.");
                console.log("   Get a fresh key from: https://aistudio.google.com/app/apikey");
            }
            return;
        }

        const data = await response.json();
        console.log("✅ Available models that support generateContent:");

        const compatibleModels = data.models.filter(model =>
            model.supportedGenerationMethods?.includes('generateContent')
        );

        compatibleModels.forEach(model => {
            console.log(`  - ${model.name}`);
        });

        if (compatibleModels.length === 0) {
            console.log("  (No compatible models found)");
            return;
        }

        console.log("");

        // Test 2: Try a simple text generation with the first available model
        const testModel = compatibleModels[0].name.replace('models/', '');
        console.log(`2. Testing text generation with ${testModel}...`);

        const testResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: "Say hello in one word" }]
                    }]
                })
            }
        );

        if (!testResponse.ok) {
            const error = await testResponse.text();
            console.error("❌ Error:", testResponse.status);
            console.error("Response:", error);
            return;
        }

        const testData = await testResponse.json();
        const responseText = testData.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("✅ AI Response:", responseText);
        console.log("\n🎉 SUCCESS! Your API key is working!");
        console.log("\nYou can now:");
        console.log("1. Add this API key to Supabase Edge Functions secrets");
        console.log("2. Deploy the updated AI functions");
        console.log("3. Test your app\n");

    } catch (error) {
        console.error("❌ Error:", error.message);

        if (error.message.includes("fetch failed")) {
            console.log("\n💡 Network error. Check your internet connection.");
        }
    }
}

testGeminiAPI();
