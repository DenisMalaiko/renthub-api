import Booking from '../../models/booking.js';
import { transformBooking } from './merge.js';
import { ApolloError } from 'apollo-server-express';

const bookingResolver = {
    Query: {
    },
    Mutation: {
        bookProduct: async (_, { bookingInput }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new ApolloError('Authentication failed - User not authenticated', 401);
            }

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
                throw new ApolloError('Failed to create booking', 400);
            }
        }
    }
}

export default bookingResolver;