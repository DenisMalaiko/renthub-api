const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const port = process.env.PORT || 3000;
/*const CONNECTION_STRING = "mongodb+srv://DenisMalaiko:PDZqTQidkRfcAljb@renthub.de39wzv.mongodb.net/?retryWrites=true&w=majority&appName=renthub";
const DATABASE = "renthub";*/

const app = express();

const events = [];

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
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event)
            return event;
        }
    },
    graphiql: true
}))

const posts = require('./routes/api/posts');
app.use('/api/posts', posts);

app.listen(port, () => {
    console.log(`Server ${port}`);
});