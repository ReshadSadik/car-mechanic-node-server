const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connection to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ffsd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// data handeling

async function run() {
  try {
    await client.connect();
    const database = client.db('carMechanic');
    const servicesCollection = database.collection('services');

    // GET ALL DATA API

    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();

      res.send(services);
    });

    // GET SINGLE ITEM WITH ID
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // DELETE API

    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    // POST API

    app.post('/services', async (req, res) => {
      const service = req.body;

      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// checking response

app.get('/', (req, res) => {
  res.send('running genius server');
});

app.listen(port, () => {
  console.log('running genius server on port', port);
});

// O8XdwbLhCxZFhlDt
