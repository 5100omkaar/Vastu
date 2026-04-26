// Test v1 API with different models
const API_KEY = "AIzaSyBscEZjC9N83KAzAz4On_1aIj3RLfhqJPI";

const modelsToTest = [
    { name: "gemini-1.5-pro", api: "v1" },
    { name: "gemini-1.5-flash", api: "v1" },
    { name: "gemini-1.5-pro-latest", api: "v1" },
    { name: "gemini-1.5-flash-latest", api: "v1" },
    { name: "gemini-pro", api: "v1" }
];

async function testModel(model) {
    console.log(`\nTesting: ${model.name} (${model.api} API)`);

    try {
        const url = `https://generativelanguage.googleapis.com/${model.api}/models/${model.name}:generateContent?key=${API_KEY}`;
        console.log(`URL: ${url.substring(0, 80)}...`);

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Say hello in one word" }]
                }]
            })
        });

        console.log(`Status: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`✅ SUCCESS: ${model.name}`);
            console.log(`   Response: "${text}"`);
            return model;
        } else {
            const error = await response.text();
            console.log(`❌ FAILED: ${model.name}`);
            console.log(`   Error: ${error.substring(0, 150)}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${model.name}`);
        console.log(`   ${error.message}`);
        return null;
    }
}

async function testAllModels() {
    console.log("=== Testing Gemini v1 API ===\n");
    console.log("API Key length:", API_KEY.length);

    let workingModel = null;

    for (const model of modelsToTest) {
        const result = await testModel(model);
        if (result && !workingModel) {
            workingModel = result;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("\n=== Test Complete ===\n");

    if (workingModel) {
        console.log("✅ WORKING MODEL FOUND!");
        console.log(`   Model: ${workingModel.name}`);
        console.log(`   API: ${workingModel.api}`);
        console.log(`\nUse this in your functions:`);
        console.log(`   https://generativelanguage.googleapis.com/${workingModel.api}/models/${workingModel.name}:generateContent`);
    } else {
        console.log("❌ No working models found");
        console.log("\nPossible issues:");
        console.log("1. API key might be invalid");
        console.log("2. Gemini API might not be available in your region");
        console.log("3. You might need to enable billing in Google Cloud");
    }
}

testAllModels();
