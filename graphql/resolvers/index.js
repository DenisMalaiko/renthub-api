import authResolver from "./auth.js";
import categoryResolver from "./caregory.js";
import productResolver from "./product.js";
import photoResolver from "./photo.js";

const rootResolver = {
    Query: {
        ...productResolver.Query,
        ...authResolver.Query,
        ...categoryResolver.Query,
    },
    Mutation: {
        ...productResolver.Mutation,
        ...authResolver.Mutation,
        ...categoryResolver.Mutation,
        ...photoResolver.Mutation
    }
}

export default rootResolver;