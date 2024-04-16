const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const posts = require('./routes/api/posts');


app.use("/graphql", graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        
        type RootMutation {
            createEvent(name: String): String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ["1", "2", "3"]
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}))

app.use('/api/posts', posts);

const port = process.env.PORT || 3000;

/*const CONNECTION_STRING = "mongodb+srv://DenisMalaiko:PDZqTQidkRfcAljb@renthub.de39wzv.mongodb.net/?retryWrites=true&w=majority&appName=renthub";
const DATABASE = "renthub";*/

app.listen(port, () => {
    console.log(`Server ${port}`);
});