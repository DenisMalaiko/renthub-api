const Category = require("../../models/category");
const {transformBooking} = require("./merge");

module.exports = {
    categories: async () => {
        try {
            const categories = await Category.find();
            return categories.map(category => {
                return {
                    id: category.id,
                    ...category._doc,
                }
            })
        } catch (err) {
            throw err;
        }
    },
    createCategory: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthenticated!")
        }

        try {
            const category = await new Category({
                name: args.categoryInput.name
            });

            const result = await category.save();

            return {
                ...result._doc,
                _id: result.id
            }
        } catch (err) {
            throw err;
        }
    }
}