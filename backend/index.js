const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

const url = 'mongodb+srv://andressolorio48_db_user:kpyNK8oqlwBojCM8@makermarketdb.1igjx7c.mongodb.net/?appName=makerMarketDB';
const client = new MongoClient(url);

const dbName = 'makerMarketDB';

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

app.get('/equipment', async(req, res) => {
    try {
        const equipment = await db.collection('equipment').find({}).toArray();
        res.json(equipment);
    } catch(err) {
        res.status(500).send('Error fetching equipment.');
    }
});

connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
