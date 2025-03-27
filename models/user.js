import mongoose from "mongoose";

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
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

export default mongoose.model("User", userSchema);