const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose")
const port = process.env.PORT || 8080;
const isAuth = require("../middleware/is-auth");

const graphQlSchema = require("../graphql/schema/index");
const graphQlResolvers = require("../graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(isAuth);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

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
                    cityId: x.geonameId,
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

/*const posts = require('./routes/api/posts');
app.use('/api/posts', posts);*/

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

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
