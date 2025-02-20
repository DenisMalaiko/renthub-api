import authResolver from "./auth.js";
import bookingResolver from "./booking.js";
import categoryResolver from "./caregory.js";
import eventsResolver from "./events.js";
import productResolver from "./product.js";
import fileResolver from "./file.js";



const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...categoryResolver,
    ...eventsResolver,
    ...productResolver,
    ...fileResolver,
}

export default rootResolver;