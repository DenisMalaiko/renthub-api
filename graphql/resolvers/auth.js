const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { events } = require("../resolvers/merge");

module.exports =  {
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
                email: args.userInput.email,
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
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
};