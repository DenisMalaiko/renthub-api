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

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://renthub-official.netlify.app"
    ],
    credentials: true
}));

app.use(graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 1
}));
app.use(express.json());
app.use(isAuth);

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

        server.applyMiddleware({
            app,
            cors: {
                origin: [
                    "http://localhost:3000",
                    "https://renthub-official.netlify.app"
                ],
                credentials: true, // Дозволяємо куки та заголовки авторизації
                allowedHeaders: ["Content-Type", "Authorization", "Apollo-Require-Preflight"],
            },
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    })
    .catch((error) => console.log(error.message));

app.get('/image/:id', async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const gfs = global.gfs;

        gfs.find({ _id: fileId }).toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({ message: "Файл не найден" });
            }

            res.set("Content-Type", files[0].contentType);
            const readStream = gfs.openDownloadStream(fileId);
            readStream.pipe(res);
        });
    } catch (error) {
        console.error("Ошибка при получении файла:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

app.get('/searchCity', async (req, res) => {
    const city = req.query.city;
    console.log("CITY ", city)
    const url = `http://api.geonames.org/searchJSON?q=${city}&username=Renthub`;

    try {
        console.log("START FETCH")
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

        console.log("DONE ", result)
        res.json(result);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});