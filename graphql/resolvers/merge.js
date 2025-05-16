import User from "../../models/user.js";
import Category from "../../models/category.js";
import Product from "../../models/product.js";

const transformProduct = product => {
    return {
        id: product.id,
        ...product._doc,
        owner: user.bind(this, product._doc.owner),
        categories: category.bind(this, product._doc.categories)
    }
}

const transformBooking = booking => {
    return {
        id: booking.id,
        ...booking._doc,
        owner: user.bind(this, booking._doc.owner),
        renter: user.bind(this, booking._doc.renter),
        product: product.bind(this, booking._doc.product)
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

const product = async productId => {
    try {
        const product = await Product.findById(productId);
        return {
            ...product._doc,
            _id: product.id,
        }
    } catch (error) {
        throw error;
    }
}


export {
    transformProduct,
    transformBooking
}
