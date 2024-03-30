const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();

const CONNECTION_STRING = "mongodb+srv://DenisMalaiko:PDZqTQidkRfcAljb@renthub.de39wzv.mongodb.net/?retryWrites=true&w=majority&appName=renthub";
const DATABASE = "renthub";


router.get("/", async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

router.post("/", async (req, res) => {
   const posts = await loadPostsCollection();

   await posts.insertOne({
      text: req.body.text,
      createdAt: new Date()
   });

   res.status(201).send();
});

router.delete("/:id", async (req, res) => {
    const posts = await loadPostsCollection();

    await posts.deleteOne({
        _id: new mongodb.ObjectId(req.params.id)
    });

    res.status(200).send();
})

async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect(CONNECTION_STRING);

    return client.db(DATABASE).collection("posts");
}

module.exports = router;