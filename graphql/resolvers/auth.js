import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { events } from "./merge.js";

const authResolver = {
    users: async () => {
        try {
            const users = await User.find();

            return users.map(user => {
                return {
                    ...user._doc,
                    _id: user.id,
                    createdEvents: events.bind(this, user._doc.createdEvents)
                }
            })
        } catch (error) {
            throw error
        }
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email});

            if(existingUser) {
                throw new Error("User exists already.")
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = await new User({
                name: args.userInput.name,
                login: args.userInput.login,
                email: args.userInput.email,
                city: args.userInput.city,
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
    updateUser: async (args, req) => {

        /*if(!req.isAuth) {
            throw new Error("Unauthenticated!")
        }*/

        try {
            const user = await User.findByIdAndUpdate(
                args.userUpdateInput._id,
                {
                    name: args.userUpdateInput.name,
                    login: args.userUpdateInput.login,
                    email: args.userUpdateInput.email,
                    city: args.userUpdateInput.city,
                },
                { new: true }
            );

            if (!user) {
                throw new Error("User not found!");
            }

            return user;
        } catch (error) {
            throw error;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if(!user) {
            throw new Error("User does not exists!")
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual) {
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
            city: user.city
        }
    }
};

export default authResolver;