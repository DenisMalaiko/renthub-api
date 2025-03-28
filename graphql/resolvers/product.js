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
                    photo: productInput.photo
                });

                const result = await product.save();
                return transformProduct(result);
            } catch (err) {
                throw err;
            }
        },
        deleteProduct: async (_, { productId }, context) => {
            console.log("DELETE PRODUCT ", productId)

            const { req } = context;

            if(!req.isAuth) {
                throw new Error("Unauthenticated!")
            }

            try {
                console.log("TRY")
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