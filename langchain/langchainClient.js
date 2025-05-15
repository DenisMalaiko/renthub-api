import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";


const llm = new ChatOpenAI({
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
});

export async function askLLM(prompt) {
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
}
