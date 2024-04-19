const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose")
const port = process.env.PORT || 3000;

const Event = require("../models/event");

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
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });

            return event.save()
                .then((result) => {
                    return {_id: result.id, ...result._doc}
                }).catch(error => {
                    throw error;
                });
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
