import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";

import { ApolloServer} from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";

import { GridFSBucket } from "mongodb";

//import graphQlSchema from "../graphql/schema/index.js";
import typeDefs from "../graphql/schema/index.js";
import graphQlResolvers from "../graphql/resolvers/index.js";
import isAuth from "../middleware/is-auth.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(isAuth);
app.use(graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 1
}));

/*app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
}));*/

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@renthub.de39wzv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=${process.env.MONGO_DB}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(async () => {

        const db = mongoose.connection.db;
        global.gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

        const server = new ApolloServer({
            typeDefs,
            resolvers: graphQlResolvers,
            context: ({ req }) => ({ req }),
        });

        await server.start();
        server.applyMiddleware({ app });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    })
    .catch((error) => console.log(error.message));


app.get('/searchCity', async (req, res) => {
    const city = req.query.city;
    console.log("CITY ", city)
    const url = `http://api.geonames.org/searchJSON?q=${city}&username=Renthub`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const result = data.geonames
            .map((x) => {
                return {
                    cityId: x.geonameId.toString(),
                    cityName: x.name,
                    countryId: x.countryId,
                    countryName: x.countryName,
                    fullAddress: `${x.name}, ${x.countryName}`
                }
            })
            .filter((item, index, self) => index === self.findIndex((t) => t.fullAddress === item.fullAddress))
            .slice(0, 5);

        res.json(result);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});