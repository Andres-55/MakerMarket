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

// gets all reviews for a piece of equipment
app.get('/equipment/:id/reviews', async(req, res) => {
    try {
        const reviews = await db.collection('reviews')
            .find({ equipmentId: req.params.id })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(reviews);
    } catch(err) {
        res.status(500).send('Error fetching reviews.');
    }
});

app.post('/equipment/:id/reviews', express.json(), async(req, res) => {
    try {
        const authorId = req.body.authorId;
        const rating = req.body.rating;
        const comment = req.body.comment;

        const result = await db.collection('reviews').insertOne({

        });

        res.status(201).json({ _id: result.insertedId });
    } catch(err) {
        res.status(500).send('Error posting review.');
    }
});

// gets a user's profile
app.get('/users/:id', async(req, res) => {
    try {
        const user = await db.collection('users').findOne(

        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json(user);
    } catch(err) {
        res.status(500).send('Error fetching user.');
    }
});

// updates a user's profile
app.put('/users/:id', express.json(), async(req, res) => {
    try {
        const { name, email, phone, bio, avatarUrl } = req.body;

        await db.collection('users').updateOne(

        );

        res.sendStatus(200);
    } catch(err) {
        res.status(500).send('Error updating profile.');
    }
});

connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
