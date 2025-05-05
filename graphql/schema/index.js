import { gql } from "apollo-server-express";

const typeDefs = gql`
        scalar Upload
        
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
        }
        
        type Category {
            _id: ID
            name: String!
        }
        
        type Product {
            _id: ID
            name: String!
            price: Float!
            photo: String!
            user: User!
            categories: [Category!]
        }
        
        type Response {
            status: Float!
            message: String!
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
            photo: String!
            user: String!
            categories: [String]
        }
        
       
        
        
        
        type Query {
            users: [User!]!
            login(email: String!, password: String!): UserResponse
            
            products: [Product!]!
            product(productId: String!): Product!
            productsByUser(userId: String!): [Product!]!
            
            categories: [Category!]!
        }
        
        type Mutation {
            createUser(userInput: UserInput): User
            updateUser(userUpdateInput: UserUpdateInput): User
            
            createCategory(categoryInput: CategoryInput): Category
            
            createProduct(productInput: ProductInput!): Product!
            deleteProduct(productId: String!): Response!
            
            uploadPhoto(photo: Upload!): Photo!
        }
        
        schema {
            query: Query
            mutation: Mutation
        }
    `;

export default typeDefs;