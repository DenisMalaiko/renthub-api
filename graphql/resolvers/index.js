const authResolver = require("./auth");
const bookingResolver = require("./booking");
const eventsResolver = require("./events");
const categoryResolver = require("./caregory");


const rootResolver ={
    ...authResolver,
    ...bookingResolver,
    ...eventsResolver,
    ...categoryResolver
}

module.exports = rootResolver;