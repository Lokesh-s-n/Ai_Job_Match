// server/test.js
import dotenv from "dotenv";
import { CohereClientV2 } from "cohere-ai";

dotenv.config();

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

(async () => {
  try {
    console.log("🔍 Testing Cohere embeddings...");

    const res = await cohere.embed({
      model: "embed-english-v3.0",
      inputType: "search_document",
      embeddingTypes: ["float"], // required
      inputs: [
        { content: [{ type: "text", text: "Hello world" }] },
        { content: [{ type: "text", text: "This is a test sentence" }] },
      ],
    });

    console.log("✅ Embed test successful!");
    console.log("Embedding length:", res.embeddings.float[0].length);
  } catch (err) {
    console.error(
      "❌ Embed test failed:",
      err.message,
      err.response?.body || err.stack
    );
  }
})();
