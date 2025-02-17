const authResolver = require("./auth");
const bookingResolver = require("./booking");
const eventsResolver = require("./events");
const categoryResolver = require("./caregory");
const productResolver = require("./product")


const rootResolver ={
    ...authResolver,
    ...bookingResolver,
    ...eventsResolver,
    ...categoryResolver,
    ...productResolver
}

module.exports = rootResolver;