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
        productsByUser: async (_, { userId }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new Error("Unauthenticated!")
            }

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
        createProduct: async (_, { productInput }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new Error("Unauthenticated!")
            }

            try {
                const product = await new Product({
                    name: productInput.name,
                    price: productInput.price,
                    user: productInput.user,
                    categories: productInput.categories,
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