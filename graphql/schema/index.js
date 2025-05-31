import { gql } from "apollo-server-express";

const typeDefs = gql`
        scalar Upload
        scalar Date

        type Photo {
            id: ID!
            filename: String!
            url: String!
        }    
        
        type User {
            _id: ID
            name: String!
            login: String!
            email: String!
            city: City!
            role: String!
            password: String
        }
        
        type City {
            cityId: String!
            cityName: String!
            countryId: String!
            countryName: String!
            fullAddress: String!
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
            role: String!
        }
        
        type Category {
            _id: ID
            name: String!
            icon: String!
        }
        
        type Product {
            _id: ID
            name: String!
            description: String!
            price: Float!
            photo: String!
            owner: User!
            categories: [Category!]
            city: CityType!
        }
        
        type Response {
            status: Float!
            message: String!
        }

        type Booking {
            _id: ID
            range: [Date!]
            createdAt: Date!
            owner: User!
            renter: User!
            product: Product!
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
            role: String!
        }
        
        input UserUpdateInput {
            _id: String!
            name: String!
            login: String!
            email: String!
            city: CityInput!
            role: String!
        }
        
        input CategoryInput {
            name: String!
        }

        input ProductInput {
            name: String!
            description: String!
            price: Float!
            photo: String!
            owner: String!
            categories: [String]
            city: CityInput!
        }
        
        input BookingInput {
            product: String!
            owner: String!
            renter: String!
            range: [Date!]
            createdAt: Date!
        }
        
        input ProductsBySearchInput {
            categories: [String],
            city: CityInput!
            product: String!
            range: [Date!]
        }
        
        
        type Query {
            users: [User!]!
            login(email: String!, password: String!): UserResponse

            product(productId: String!): Product!
            products: [Product!]!
            productsByUser(ownerId: String!): [Product!]!
            productsBySearch(productsBySearchInput: ProductsBySearchInput): [Product!]!

            bookingsByUser(renterId: String!): [Booking!]!
            
            categories: [Category!]!
            askLangChain(prompt: String!): String!
        }
        
        type Mutation {
            createUser(userInput: UserInput): User
            updateUser(userUpdateInput: UserUpdateInput): User
            createCategory(categoryInput: CategoryInput): Category
            createProduct(productInput: ProductInput!): Product!
            deleteProduct(productId: String!): Response!
            bookProduct(bookingInput: BookingInput!): Booking!
            deleteBooking(bookingId: String!): Response!
            uploadPhoto(photo: Upload!): Photo!
        }
        
        schema {
            query: Query
            mutation: Mutation
        }
    `;

export default typeDefs;