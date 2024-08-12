require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3aom8f0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const placeCollection = client.db('placesDB').collection('places');
        const reviewCollection = client.db('placesDB').collection('reviews');
        

        // Get all  from the database
        app.get('/place', async (req, res) => {
            const cursor = placeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get a specific  by id
        app.get('/place/:id', async (req, res) => {
            const id = req.params.id;
            if (ObjectId.isValid(id)) {
                const query = { _id: new ObjectId(id) };
                const result = await placeCollection.findOne(query);
                res.send(result);
            } else {
                res.status(400).send({ error: 'Invalid ID format' });
            }
        });

         // Get all reviews from the database
         app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Timeless Bangladesh is Running');
});

app.listen(port, () => {
    console.log(`imeless Bangladesh is Running on Port: ${port}`);
});
