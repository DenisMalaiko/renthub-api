const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type Event {
            _id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        } 
        
        type User {
            _id: ID
            name: String!
            login: String!
            email: String!
            city: City!
            password: String
            createdEvents: [Event!]
        }
        
        type City {
            cityId: String!
            cityName: String!
            cityFullName: String!
        }
        
        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }
        
        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input CityInput {
            cityId: String!
            cityName: String!
            cityFullName: String!
        }

        input UserInput {
            name: String!
            login: String!
            email: String!
            city: CityInput!
            password: String!
            createdEvents: [String]
        }
        
        type RootQuery {
            events: [Event!]!
            users: [User!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID): Booking!
            cancelBooking(bookingId: ID!): Event
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)