const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("../resolvers/merge");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            throw error
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthenticated!")
        }
        try {
            const event = await new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: dateToString(args.eventInput.date),
                creator: req.userId
            });

            const result = await event.save();

            const createdEvent = transformEvent(result);

            const creator = await User.findById( req.userId);

            if(!creator) {
                throw new Error("User not found")
            }

            creator.createdEvents.push(event);

            await creator.save();

            return createdEvent;
        } catch (error) {
            throw error;
        }
    }
};