import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const db = client.db(process.env.MONGO_DB);
const collection = db.collection("products");

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
})

export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "default", // Назва індексу в MongoDB Atlas
    textKey: "name",
    embeddingKey: "embedding",
});