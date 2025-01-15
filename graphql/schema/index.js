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
            countryId: String!
            countryName: String!
            fullAddress: String!
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
        
        type CityType {
            cityId: String!
            cityName: String!
            countryId: String!
            countryName: String!
            fullAddress: String!
        }
        
        type UserResponse {
            _id: ID
            token: String!
            tokenExpiration: Int!
            name: String!
            login: String!
            email: String!
            city: CityType!
        }
        
        type Category {
            _id: ID
            name: String!
        }
        
        type Product {
            _id: ID
            name: String!
            price: Float!
            userId: ID!
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
            countryId: String!
            countryName: String!
            fullAddress: String!
        }

        input UserInput {
            name: String!
            login: String!
            email: String!
            city: CityInput!
            password: String!
            createdEvents: [String]
        }
        
        input UserUpdateInput {
            _id: String!
            name: String!
            login: String!
            email: String!
            city: CityInput!
        }
        
        input CategoryInput {
            name: String!
        }
        
        input ProductInput {
            name: String!
            price: Float!
            userId: String!
        }
       
        
        
        
        type RootQuery {
            events: [Event!]!
            users: [User!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): UserResponse!
            products(userId: String!): [Product!]!
            categories: [Category!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            updateUser(userUpdateInput: UserUpdateInput): User
            bookEvent(eventId: ID): Booking!
            cancelBooking(bookingId: ID!): Event
            
            createCategory(categoryInput: CategoryInput): Category
            createProduct(productInput: ProductInput): Product
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)