import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    product: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    renter: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export default mongoose.model("Booking", bookingSchema)