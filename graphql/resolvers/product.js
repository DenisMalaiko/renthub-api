import Product from "../../models/product.js";
import { transformProduct } from "./merge.js";

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
        productsByUser: async (_, { userId }) => {
            try {
                const products = await Product.find({ user: userId });
                return products.map(product => {
                    return transformProduct(product)
                });
            } catch (err) {
                throw err;
            }
        },
    },
    Mutation: {
        createProduct: async (args, req) => {
            try {
                const product = await new Product({
                    name: args.productInput.name,
                    price: args.productInput.price,
                    user: args.productInput.user,
                    categories: args.productInput.categories,
                });

                const result = await product.save();
                return transformProduct(result);
            } catch (err) {
                throw err;
            }
        },
    }
}

export default productResolver;