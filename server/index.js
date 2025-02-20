import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import { graphqlUploadExpress } from "graphql-upload";

import graphQlSchema from "../graphql/schema/index.js";
import graphQlResolvers from "../graphql/resolvers/index.js";
import isAuth from "../middleware/is-auth.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(isAuth);
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@renthub.de39wzv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=${process.env.MONGO_DB}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
    .catch((error) => console.log(error.message));