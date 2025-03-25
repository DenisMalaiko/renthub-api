import mongoose from "mongoose";

const Schema = mongoose.Schema;

const photoSchema = new Schema({
    filename: String,
    mimetype: String,
    path: String
});

export default mongoose.model("Photo", photoSchema)