const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT || 4000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elbg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectId;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function server() {
    try {
        await client.connect();
        const database = client.db('assignment12');
        const productsCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.json(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const objId = ObjectId(id);
            const query = {
                _id: objId
            }
            const result = await productsCollection.findOne(query);
            res.json(result);
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const objId = ObjectId(id);
            const query = {
                _id: objId
            }
            const result = await productsCollection.deleteOne(query);

            res.json(result)
        })
        app.post('/reviews', async (req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.json(result)
        })
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;

            const query = { email: email };
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        app.post('/orders', async (req, res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            res.json(result)
        })
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const updateDoc = {
                $set: {
                    shipped: true
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc)
            res.json(result)
        })
        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.json(result);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email
            }
            const result = await userCollection.findOne(query);
            res.json(result);
        })
        app.put('/admin', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email }
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
    }
    finally {

    }
}
server().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello world');
})
app.listen(port, () => {
    console.log(port);
})