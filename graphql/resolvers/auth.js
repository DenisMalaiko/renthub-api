import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authResolver = {
    Query: {
        users: async () => {
            try {
                const users = await User.find();

                return users.map(user => {
                    return {
                        ...user._doc,
                        _id: user.id,
                    }
                })
            } catch (error) {
                throw error
            }
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error("User does not exists!")
            }

            const isEqual = await bcrypt.compare(password, user.password)
            if (!isEqual) {
                throw new Error("Password is incorrect!");
            }

            const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
                expiresIn: "1h"
            });

            return {
                _id: user.id,
                token: token,
                tokenExpiration: 1,
                name: user.name,
                login: user.login,
                email: user.email,
                city: user.city,
                role: user.role
            }
        }
    },
    Mutation: {
        createUser: async (_, { userInput }) => {
            try {
                const existingUser = await User.findOne({email: userInput.email});

                if (existingUser) {
                    throw new Error("User exists already.")
                }

                const hashedPassword = await bcrypt.hash(userInput.password, 12);

                const user = await new User({
                    name: userInput.name,
                    login: userInput.login,
                    email: userInput.email,
                    city: userInput.city,
                    role: userInput.role,
                    password: hashedPassword,
                });

                const result = await user.save();

                return {
                    ...result._doc,
                    password: null,
                    _id: result.id
                }
            } catch (error) {
                throw error;
            }
        },
        updateUser: async (_, { userUpdateInput }, context) => {
            const { req } = context;

            if(!req.isAuth) {
                throw new Error("Unauthenticated!")
            }

            try {
                const user = await User.findByIdAndUpdate(
                    userUpdateInput._id,
                    {
                        name: userUpdateInput.name,
                        login: userUpdateInput.login,
                        email: userUpdateInput.email,
                        city: userUpdateInput.city,
                        role: userUpdateInput.role
                    },
                    {new: true}
                );

                if (!user) {
                    throw new Error("User not found!");
                }

                return user;
            } catch (error) {
                throw error;
            }
        },
    }
};

export default authResolver;