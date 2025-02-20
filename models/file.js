import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: {
        type: String
    },
    mimetype: {
        type: String
    },
    path: {
        type: String
    }
});

export default mongoose.model("File", FileSchema);