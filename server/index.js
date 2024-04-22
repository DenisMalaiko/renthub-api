const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose")
const port = process.env.PORT || 3000;

const graphQlSchema = require("../graphql/schema/index");
const graphQlResolvers = require("../graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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
