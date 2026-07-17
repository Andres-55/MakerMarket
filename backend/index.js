require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT;

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

const dbName = process.env.DB_NAME;

let db;

async function connectToDB() {
    try{
        await client.connect();
        console.log('Connected successfully to MongoDB');
        db = client.db(dbName);
    } catch(err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

app.use(cors());

app.get('/', (req, res) => {
    res.send('Maker Market Backend running');
});

//gets all the equipment from the data base
app.get('/equipment', async(req, res) => {
    try {
        const equipment = await db.collection('equipment').find({}).toArray();
        res.json(equipment);
    } catch(err) {
        res.status(500).send('Error fetching equipment.');
    }
});

//gets the details from a specific equipment from the database
app.get('/equipment/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const equipment = await db.collection('equipment').findOne({_id: new ObjectId(id)});

        if(!equipment) {
            return res.status(404).send("Equipment not found");
        }

        res.json(equipment);
    } catch(err) {
        res.status(500).send("Error fetching equipment details.");
    }
});

connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
