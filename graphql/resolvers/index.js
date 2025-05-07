import authResolver from "./auth.js";
import categoryResolver from "./caregory.js";
import productResolver from "./product.js";
import photoResolver from "./photo.js";
import bookingResolver from "./booking.js";

const rootResolver = {
    Query: {
        ...productResolver.Query,
        ...authResolver.Query,
        ...categoryResolver.Query,
        ...bookingResolver.Query,
    },
    Mutation: {
        ...productResolver.Mutation,
        ...authResolver.Mutation,
        ...categoryResolver.Mutation,
        ...photoResolver.Mutation,
        ...bookingResolver.Mutation
    }
}

export default rootResolver;