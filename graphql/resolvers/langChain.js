import { askLLM } from "../../langchain/langchainClient.js";

const langChainResolver = {
    Query: {
        async askLangChain(_, { prompt }) {
            const response = await askLLM(prompt);
            console.log("RESPONSE RESOLVER: ", response);

            //await YourModel.create({ prompt, response });
            return response;
        }
    },
    Mutation: {

    }
}

export default langChainResolver;