// Find the actual working Gemini API configuration
const API_KEY = "AIzaSyBscEZjC9N83KAzAz4On_1aIj3RLfhqJPI";

async function listAvailableModels() {
    console.log("=== Fetching Available Models from Google ===\n");

    // Try to list models using v1 API
    try {
        console.log("Trying v1 API...");
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
        );

        if (response.ok) {
            const data = await response.json();
            console.log("\n✅ SUCCESS! Available models:\n");

            if (data.models && data.models.length > 0) {
                data.models.forEach(model => {
                    console.log(`  - ${model.name}`);
                    console.log(`    Display Name: ${model.displayName}`);
                    console.log(`    Supports: ${model.supportedGenerationMethods?.join(", ")}`);
                    console.log("");
                });

                // Find a model that supports generateContent
                const textModel = data.models.find(m =>
                    m.supportedGenerationMethods?.includes("generateContent") &&
                    !m.name.includes("vision")
                );

                const visionModel = data.models.find(m =>
                    m.supportedGenerationMethods?.includes("generateContent") &&
                    m.name.includes("vision")
                );

                console.log("\n=== RECOMMENDED MODELS ===");
                if (textModel) {
                    console.log(`\nFor Chat (text): ${textModel.name}`);
                    console.log(`Display Name: ${textModel.displayName}`);
                }
                if (visionModel) {
                    console.log(`\nFor Images (vision): ${visionModel.name}`);
                    console.log(`Display Name: ${visionModel.displayName}`);
                }

                return { textModel, visionModel };
            } else {
                console.log("No models found in response");
                return null;
            }
        } else {
            const error = await response.text();
            console.log(`❌ v1 API failed: ${response.status}`);
            console.log(error);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    // Try v1beta API
    try {
        console.log("\nTrying v1beta API...");
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        if (response.ok) {
            const data = await response.json();
            console.log("\n✅ SUCCESS! Available models:\n");

            if (data.models && data.models.length > 0) {
                data.models.forEach(model => {
                    console.log(`  - ${model.name}`);
                    console.log(`    Display Name: ${model.displayName}`);
                    console.log(`    Supports: ${model.supportedGenerationMethods?.join(", ")}`);
                    console.log("");
                });

                const textModel = data.models.find(m =>
                    m.supportedGenerationMethods?.includes("generateContent") &&
                    !m.name.includes("vision")
                );

                const visionModel = data.models.find(m =>
                    m.supportedGenerationMethods?.includes("generateContent") &&
                    m.name.includes("vision")
                );

                console.log("\n=== RECOMMENDED MODELS ===");
                if (textModel) {
                    console.log(`\nFor Chat (text): ${textModel.name}`);
                    console.log(`Display Name: ${textModel.displayName}`);
                }
                if (visionModel) {
                    console.log(`\nFor Images (vision): ${visionModel.name}`);
                    console.log(`Display Name: ${visionModel.displayName}`);
                }

                return { textModel, visionModel };
            }
        } else {
            const error = await response.text();
            console.log(`❌ v1beta API failed: ${response.status}`);
            console.log(error);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    return null;
}

async function testModel(modelName, apiVersion) {
    console.log(`\n=== Testing ${modelName} ===`);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Say hello" }]
                    }]
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`✅ SUCCESS!`);
            console.log(`Response: "${text}"`);
            return true;
        } else {
            const error = await response.text();
            console.log(`❌ FAILED: ${response.status}`);
            console.log(error.substring(0, 200));
            return false;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        return false;
    }
}

async function main() {
    const models = await listAvailableModels();

    if (models && models.textModel) {
        console.log("\n\n=== TESTING RECOMMENDED TEXT MODEL ===");
        // Extract just the model name without the "models/" prefix
        const modelName = models.textModel.name.replace("models/", "");
        const apiVersion = models.textModel.name.includes("1.5") ? "v1" : "v1beta";

        await testModel(modelName, apiVersion);

        console.log("\n\n=== FINAL SOLUTION ===");
        console.log(`\nUse this model name: ${modelName}`);
        console.log(`Use this API version: ${apiVersion}`);
        console.log(`\nFull URL:`);
        console.log(`https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent`);
    } else {
        console.log("\n\n❌ Could not find working models");
        console.log("\nPossible issues:");
        console.log("1. API key might be restricted or invalid");
        console.log("2. Gemini API not available in your region");
        console.log("3. Need to enable API in Google Cloud Console");
    }
}

main();
