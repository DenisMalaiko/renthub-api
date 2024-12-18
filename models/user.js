const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city: {
        type: Object,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

module.exports = mongoose.model("User", userSchema);