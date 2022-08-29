const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jerutqq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express()
app.use(cors())
app.use(bodyParser.json())



client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.acknowledged)
            })
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })
    app.post('/productsByKeys', (req, res) => {
        const productKey = req.body;
        productsCollection.find({ key: { $in: productKey } })
            .toArray((err, document) => {
                res.send(document)
            })
    })
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result);
                res.send(result.acknowledged)
            })
    })
});


app.listen(5000)