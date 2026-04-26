// Test which Gemini model names work with v1beta API
// Replace YOUR_API_KEY with your actual Google API key

const API_KEY = "AIzaSyBscEZjC9N83KAzAz4On_1aIj3RLfhqJPI";

const modelsToTest = [
    "gemini-pro",
    "gemini-pro-vision",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "models/gemini-pro",
    "models/gemini-pro-vision"
];

async function testModel(modelName) {
    console.log(`\nTesting: ${modelName}`);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: "Say hello" }]
                    }]
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ SUCCESS: ${modelName}`);
            console.log(`   Response: ${data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 50)}`);
            return true;
        } else {
            const error = await response.text();
            console.log(`❌ FAILED: ${modelName} (${response.status})`);
            console.log(`   Error: ${error.substring(0, 100)}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${modelName}`);
        console.log(`   ${error.message}`);
        return false;
    }
}

async function testAllModels() {
    console.log("Testing Gemini Model Names...\n");
    console.log("API Key length:", API_KEY.length);

    if (API_KEY === "YOUR_API_KEY_HERE") {
        console.log("\n⚠️  Please replace YOUR_API_KEY_HERE with your actual API key!");
        return;
    }

    for (const model of modelsToTest) {
        await testModel(model);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }

    console.log("\n=== Test Complete ===");
}

testAllModels();
