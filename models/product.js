import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
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
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: "Category"
    },
});

export default mongoose.model("Product", productSchema);