import Booking from '../../models/booking.js';
import {transformBooking} from './merge.js';
import { ApolloError } from 'apollo-server-express';

const bookingResolver = {
    Query: {
        bookingsByUser: async (_, { renterId }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new ApolloError('Authentication failed - User not authenticated', 401);
            }

            try {
                const bookings = await Booking.find({ renter: renterId });
                return bookings.map(booking => {
                    return transformBooking(booking)
                });
            } catch (err) {
                throw err;
            }
        },
    },
    Mutation: {
        bookProduct: async (_, { bookingInput }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new ApolloError('Authentication failed - User not authenticated', 401);
            }

            try {
                const booking = await new Booking({
                    range: bookingInput.range,
                    createdAt: bookingInput.createdAt,
                    product: bookingInput.product,
                    owner: bookingInput.owner,
                    renter: bookingInput.renter
                });

                const result = await booking.save();
                return transformBooking(result);
            } catch (err) {
                throw new ApolloError('Failed to create booking', 400);
            }
        },
        deleteBooking: async (_, { bookingId }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new ApolloError('Authentication failed - User not authenticated', 401);
            }

            try {
                const booking = await Booking;
                await booking.findByIdAndDelete(bookingId);

                return {
                    status: 200,
                    message: "Booking has been successfully deleted!"
                }
            } catch (err) {
                throw new ApolloError('Failed to create booking', 400);
            }

        }
    }
}

export default bookingResolver;