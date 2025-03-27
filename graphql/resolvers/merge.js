import User from "../../models/user.js";
import Category from "../../models/category.js";
import {dateToString} from "../../helpers/date.js";

const transformProduct = product => {
    return {
        id: product.id,
        ...product._doc,
        user: user.bind(this, product._doc.user),
        categories: category.bind(this, product._doc.categories)
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
        }
    } catch (error) {
        throw error;
    }
}

const category = async categoriesIds => {
    try {
        const categories = await Category.find({ _id: { $in: categoriesIds } });
        return categories.map(category => ({
            ...category._doc,
            _id: category.id
        }));
    } catch (error) {
        throw error;
    }
}

export {
    transformProduct
}
