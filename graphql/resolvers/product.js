import Product from "../../models/product.js";
import Booking from "../../models/booking.js";
import { transformProduct } from "./merge.js";
import { ApolloError } from "apollo-server-express";


import { OpenAIEmbeddings } from "@langchain/openai";
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

const productResolver = {
    Query: {
        products: async () => {
            try {
                const products = await Product.find();
                return products.map(product => {
                    return transformProduct(product)
                });
            } catch (err) {
                throw err;
            }
        },
        product: async (_, { productId }, context) => {
            try {
                const product = await Product.findById(productId);
                return transformProduct(product);
            } catch (err) {
                throw err;
            }
        },
        productsByUser: async (_, { ownerId }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new ApolloError('Authentication failed - User not authenticated', 401);
            }

            try {
                const products = await Product.find({ owner: ownerId });
                return products.map(product => { 
                    return transformProduct(product)
                });
            } catch (err) {
                throw err;
            }
        },
        productsBySearch: async (_, { productsBySearchInput }, context) => {
            const { categories, city, product, range } = productsBySearchInput;

            try {
                const products = await Product.find({
                    categories: { $in: categories },
                    'city.cityId': city.cityId,
                    $or: [
                        { name: { $regex: product, $options: 'i' } },
                        { description: { $regex: product, $options: 'i' } }
                    ]
                });

                const bookings = await Booking.find({
                    range: { $in: range },
                    product: { $in: products.map(product => product._id) }
                }).select('product');

                const bookedProducts = bookings.flatMap(booking => String(booking.product));
                const result = products.filter(product => !bookedProducts.includes(String(product._id)));

                return result.map(product => {
                    return transformProduct(product)
                });
            } catch (err) {
                throw err;
            }
        }
    },
    Mutation: {
        createProduct: async (_, { productInput }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new ApolloError('Authentication failed - User not authenticated', 401);
            }

            try {
                const { name, description, price, owner, categories, photo, city } = productInput;
                const text = `${name}. ${description}. Price: ${price}`;
                console.log("TEXT ", text);
                const [embedding] = await embeddings.embedDocuments([text]);
                const product = new Product({
                    name,
                    description,
                    price,
                    owner,
                    categories,
                    photo,
                    embedding,
                    city
                });

                const result = await product.save();
                return transformProduct(result);
            } catch (err) {
                throw err;
            }
        },
        deleteProduct: async (_, { productId }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new Error("Unauthenticated!")
            }

            try {
                const product = await Product;
                await product.findByIdAndDelete(productId);

                return {
                    status: 200,
                    message: "Product has been successfully deleted!"
                }
            } catch (err) {
                throw err;
            }
        }
    }
}

export default productResolver;