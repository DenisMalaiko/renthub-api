import Booking from '../../models/booking.js';
import { transformBooking } from './merge.js';

const bookingResolver = {
    Query: {
    },
    Mutation: {
        bookProduct: async (_, { bookingInput }, context) => {
            //const { req } = context;

            /*if(!req.isAuth) {
                throw new Error("Unauthenticated!")
            }*/

            try {
                const booking = await new Booking({
                    startDate: bookingInput.startDate,
                    endDate: bookingInput.endDate,
                    createdAt: bookingInput.createdAt,
                    product: bookingInput.product,
                    user: bookingInput.user
                });

                const result = await booking.save();
                return transformBooking(result);
            } catch (err) {
                console.log("ERROR", err)
                throw err;
            }
        }
    }
}

export default bookingResolver;