const Product = require("../../models/product");

module.exports = {
    products: async () => {
        try {
            console.log("GET PRODUCTS")
            return await Product.find();
        } catch (err) {
            throw err;
        }
    },
    productsByUser: async ({ userId }) => {
        try {
            console.log("GET PRODUCTS BY USER ID ", userId)
            return await Product.find({ userId: userId });
        } catch (err) {
            throw err;
        }
    },
    createProduct: async (args, req) => {
        console.log("START createProduct")
        console.log("---------")

        try {
            const product = await new Product({
                name: args.productInput.name,
                price: args.productInput.price,
                userId: args.productInput.userId,
            });

            const result = await product.save();

            return {
                ...result._doc,
                _id: result.id
            }
        } catch (err) {
            throw err;
        }
    },

}