import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: "Category"
    },
    embedding: {
        type: [Number],
        required: false
    }
});

export default mongoose.model("Product", productSchema);