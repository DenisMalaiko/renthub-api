import authResolver from "./auth.js";
import bookingResolver from "./booking.js";
import categoryResolver from "./caregory.js";
import eventsResolver from "./events.js";
import productResolver from "./product.js";
import photoResolver from "./photo.js";

const rootResolver = {
    Query: {
        ...productResolver.Query,
        ...authResolver.Query,
        ...categoryResolver.Query
    },
    Mutation: {
        ...productResolver.Mutation,
        ...authResolver.Mutation,
        ...categoryResolver.Mutation
    }
/*
    ...bookingResolver,
    ...eventsResolver,
    ...photoResolver*/
}

export default rootResolver;