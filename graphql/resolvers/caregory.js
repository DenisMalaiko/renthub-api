import Category from "../../models/category.js";

const categoryResolver = {
    Query: {
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
    },
    Mutation: {
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
}

export default categoryResolver;