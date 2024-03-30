const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);

const port = process.env.PORT || 3000;

const CONNECTION_STRING = "mongodb+srv://DenisMalaiko:PDZqTQidkRfcAljb@renthub.de39wzv.mongodb.net/?retryWrites=true&w=majority&appName=renthub";
const DATABASE = "renthub";

app.listen(port, () => {
    console.log(`Server ${port}`);
});