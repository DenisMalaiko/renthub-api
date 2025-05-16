import { askLLM } from "../../langchain/langchainClient.js";

const langChainResolver = {
    Query: {
        async askLangChain(_, { prompt }) {
            return await askLLM(prompt);
        }
    },
    Mutation: {}
}

export default langChainResolver;