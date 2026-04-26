// Run: node test-imagen.js
const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyBscEZjC9N83KAzAz4On_1aIj3RLfhqJPI";

async function testModel(modelName, usePredict) {
    const url = usePredict
        ? "https://generativelanguage.googleapis.com/v1beta/" + modelName + ":predict?key=" + API_KEY
        : "https://generativelanguage.googleapis.com/v1beta/" + modelName + ":generateContent?key=" + API_KEY;

    const body = usePredict
        ? JSON.stringify({ instances: [{ prompt: "A red circle" }], parameters: { sampleCount: 1 } })
        : JSON.stringify({
            contents: [{ parts: [{ text: "Draw a simple red circle" }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        });

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });

    const text = await response.text();
    if (response.ok) {
        const data = JSON.parse(text);
        // Check for inline image (generateContent style)
        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) => p.inlineData);
        // Check for predict style
        const base64 = data.predictions?.[0]?.bytesBase64Encoded;
        if (imagePart) {
            return "SUCCESS (generateContent) - mime: " + imagePart.inlineData.mimeType;
        } else if (base64) {
            return "SUCCESS (predict) - base64 length: " + base64.length;
        } else {
            return "OK but no image. Parts: " + JSON.stringify(parts).slice(0, 200);
        }
    } else {
        return "FAILED (" + response.status + "): " + text.slice(0, 150);
    }
}

async function main() {
    const tests = [
        ["models/gemini-2.5-flash-image", false],
        ["models/gemini-3.1-flash-image-preview", false],
        ["models/gemini-3-pro-image-preview", false],
        ["models/imagen-4.0-generate-001", true],
        ["models/imagen-4.0-fast-generate-001", true],
    ];

    for (const [model, usePredict] of tests) {
        process.stdout.write("Testing " + model + " ... ");
        const result = await testModel(model, usePredict);
        console.log(result);
    }
}

main().catch(console.error);
