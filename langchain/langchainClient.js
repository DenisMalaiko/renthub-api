import { llm } from "./llm.js";
import { vectorStore } from "./vectorStore.js";
import { HumanMessage } from "@langchain/core/messages";


export async function askLLM(prompt, k = 3) {
    console.log("ASK LLM: ", prompt)

    try {
        const docs = await vectorStore.similaritySearch(prompt, k);
        console.log("DOCS: ", docs);

        const context = docs.map(d => {
            return `Name: ${d.metadata.name}\nPrice: ${d.metadata.price}\nDescription: ${d.pageContent}`;
        }).join("\n\n");

        const fullPrompt = `
            You are a helpful and professional rental assistant for a platform that rents out various products for several days at a time
            Here is the information from the product database:\n\n${context}\n\n
            Question: ${prompt}\n\n
            If the answer concerns the price, be sure to include it. All our prices are in USD and for one day.`;

        const res = await llm.invoke([new HumanMessage(fullPrompt)]);
        console.log("RESPONSE ASK LLM: ", res.content);

        return res.content;
    } catch (err) {
        console.error("ERR: ", err)
    }
}


/*export async function askLLM(prompt) {
    console.log("ASK LLM: ", prompt)

    const res = await llm.invoke([
        new HumanMessage(prompt)
    ]).then((res) => {
        return res;
    }).catch((err) => {
        console.error("ERR: ", err)
    })

    console.log("RESPONSE ASK LLM: ", res.content)
    return res.content;
}*/
