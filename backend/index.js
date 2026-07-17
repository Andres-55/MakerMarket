require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
app.use(express.json());

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


app.post('/register', async (req, res) => {
    const {username, firstName, lastName, email, phoneNumber, bio, password} = req.body;

    if(!username || !firstName || !email || !password) {
        return res.status(400).send("Please fill out all required fields.");
    }

    const userExists = await db.collection('users').findOne({
        username: username
    });
    const emailExists = await db.collection('users').findOne({
        email: email
    });

    if(emailExists) {
        return res.status(400).send("Email already exists");
    }
    if(userExists) {
        return res.status(400).send("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        username,
        firstName,
        lastName: lastName || "",
        email, 
        phoneNumber: phoneNumber || "",
        bio: bio || "",
        passwordHash: hashedPassword,
        googleId: null,
        createdAt: new Date()
    };

    await db.collection('users').insertOne(newUser);
    console.log(req.body);
    res.send("Registered account.");
});

connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
