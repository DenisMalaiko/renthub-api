const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose")
const port = process.env.PORT || 3000;
const bcrypt = require("bcryptjs");

const Event = require("../models/event");
const User = require("../models/user");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/graphql", graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
        } 
        
        type User {
            _id: ID
            email: String!
            password: String
            createdEvents: [String]
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
            createdEvents: [String]
        }
        
        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then((events) => {
                    return events.map(event => {
                        return {_id: event.id, ...event._doc}
                    })
                })
                .catch((error) => {
                    throw error
                })
        },
        users: () => {
            return User.find()
                .then((users) => {
                    return users.map(user => {
                        return {_id: user.id, ...user._doc}
                    })
                }).catch(error => {
                    throw error
                })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "6624f253b3a0750798e3ba90"
            });
            let createdEvent;

            return event
                .save()
                .then((result) => {
                    createdEvent = {_id: result.id, ...result._doc}
                    return User.findById("6624f253b3a0750798e3ba90")
                })
                .then((user) => {
                    if(!user) {
                        throw new Error("User not found")
                    }

                    user.createdEvents.push(event);
                    return user.save();
                })
                .then((result) => {
                    return createdEvent
                })
                .catch(error => {
                    throw error;
                });
        },
        createUser: (args) => {
            return User.findOne({email: args.userInput.email}).then((user) => {
                if(user) {
                   throw new Error("User exists already.")
                }

                return bcrypt.hash(args.userInput.password, 12)
            })
            .then((hashedPassword) => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                });

                return user.save();
            })
            .then((result) => {
                return {...result._doc, password: null, _id: result.id}
            })
            .catch((error) => {
                throw error;
            })
        }
    },
    graphiql: true
}))

/*const posts = require('./routes/api/posts');
app.use('/api/posts', posts);*/

const options = {useNewUrlParser: true, useUnifiedTopology: true};
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@renthub.de39wzv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=${process.env.MONGO_DB}`,
    options
)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server ${port}`);
        });
    }).catch((error) => {
        console.log(error.message)
    });
