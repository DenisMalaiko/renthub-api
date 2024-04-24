const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
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

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);

        return {
            ...event._doc,
            _id: eventId.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        throw err;
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
    bookings: async () => {
        try {
            const bookings = await Booking.find();

            return bookings.map(booking => {
                return {
                    _id: booking.id,
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        } catch (err) {
            throw err
        }
    },
    users: async () => {
        try {
            const users = await User.find();

            return users.map(user => {
                return {
                    ...user._doc,
                    _id: user.id,
                    createdEvents: events.bind(this, user._doc.createdEvents)
                }
            })
        } catch (error) {
            throw error
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
    },
    bookEvent: async (args) => {
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventId});

            const booking = new Booking({
                user: "6624f253b3a0750798e3ba90",
                event: fetchedEvent
            });

            const result = await booking.save();

            return {
                _id: result.id,
                ...result._doc,
                user: user.bind(this, result._doc.user),
                event: singleEvent.bind(this, result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator)
            }

            await Booking.deleteOne({_id: args.bookingId})

            return event;
        } catch (err) {
            throw err;
        }
    }
};