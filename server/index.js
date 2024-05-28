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
app.use(isAuth)

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

app.get('/searchCity', async (req, res) => {
    const city = req.query.city;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&types=locality&key=AIzaSyDOU3_lOeKF2rVPCnHI9OejSOc90KLBTsY`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
