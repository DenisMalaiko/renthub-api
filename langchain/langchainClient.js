import { llm } from "./llm.js";
import { vectorStore } from "./vectorStore.js";
import { HumanMessage } from "@langchain/core/messages";


export async function askLLM(prompt, k = 3) {
    console.log("ASK LLM: ", prompt)

    try {
        const docs = await vectorStore.similaritySearch(prompt, k);
        console.log("DOCS: ", docs);

        const context = docs.map(d => d.pageContent).join("\n\n");

        const fullPrompt = `Ось інформація з документів:\n\n${context}\n\nПитання: ${prompt}`;

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
