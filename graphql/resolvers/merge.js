const Event = require("../../models/event");
const User = require("../../models/user");
const Category = require("../../models/category");
const {dateToString} = require("../../helpers/date");

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    };
}

const transformBooking = booking => {
    return {
        id: booking.id,
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const transformProduct = product => {
    return {
        id: product.id,
        ...product._doc,
        user: user.bind(this, product._doc.user),
        categories: category.bind(this, product._doc.categories)
    }
}

const events = async eventsIds => {
    try {
        const events = await Event.find({_id: {$in: eventsIds}})
        return events.map(event => {
            return transformEvent(event);
        })
    } catch (error) {
        throw error
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
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
        }
    } catch (error) {
        throw error;
    }
}

const category = async categoriesIds => {
    try {
        const categories = await Category.find({ _id: { $in: categoriesIds } });
        return categories.map(category => ({
            ...category._doc,
            _id: category.id
        }));
    } catch (error) {
        throw error;
    }
}

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformProduct = transformProduct;
