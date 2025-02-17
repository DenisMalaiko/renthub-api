const Product = require("../../models/product");
const {transformProduct} = require("./merge");

module.exports = {
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
    productsByUser: async ({ userId }) => {
        try {
            const products = await Product.find({ userId: userId });
            return products.map(product => {
                return transformProduct(product)
            });
        } catch (err) {
            throw err;
        }
    },
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