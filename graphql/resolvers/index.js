const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const events = async eventsIds => {
    try {
        const events = await Event.find({_id: {$in: eventsIds}})

        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            }
        })
    } catch (error) {
        throw error
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);

        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents )
        }
    } catch (error) {
        throw error
    }
}

module.exports =  {
    events: async () => {
        try {
            const events = await Event.find();

            return events.map(event => {
                return {
                    _id: event.id,
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            });
        } catch (error) {
            throw error
        }
    },
    users: async () => {
        try {
            const users = await User.find();

            return users.map(user => {
                return {
                    ...user._doc,
                    _id: user.id
                }
            })
        } catch (error) {

        }
    },
    createEvent: async (args) => {
        try {
            const event = await new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "6624f253b3a0750798e3ba90"
            });

            const result = await event.save();

            const createdEvent = {
                ...result._doc,
                _id: result.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }

            const creator = await User.findById("6624f253b3a0750798e3ba90");

            if(!creator) {
                throw new Error("User not found")
            }

            creator.createdEvents.push(event);

            await creator.save();

            return createdEvent;
        } catch (error) {
            throw error;
        }
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email});

            if(existingUser) {
                throw new Error("User exists already.")
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = await new User({
                email: args.userInput.email,
                password: hashedPassword,
            });

            const result = await user.save();

            return {
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch (error) {
            throw error;
        }
    }
};