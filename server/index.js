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
            return events;
        },
        createEvent: (args) => {
            console.log("_____________")
            console.log("CREATE EVENTS")
            console.log("_____________")
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });

            console.log("EVENT")
            console.log(event)
            console.log("_____________")

            return event.save()
                .then((result) => {
                    console.log("RESULT")
                    console.log(result)
                    return {...result._doc}
                }).catch(error => {
                    console.log("ERROR !!!")
                    console.log(error.message)
                    throw error;
                });
        }
    },
    graphiql: true
}))

/*const posts = require('./routes/api/posts');
app.use('/api/posts', posts);*/


mongoose.connect(`mongodb+srv://user2000:1234567890@renthub.de39wzv.mongodb.net/?retryWrites=true&w=majority&appName=renthub

`)
    .then(() => {
        console.log("SUCCESS CONNECT WITH MONGODB");

        app.listen(port, () => {
            console.log(`Server ${port}`);
        });
    }).catch((error) => {
        console.log(error.message)
    });
