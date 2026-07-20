require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}

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

        if(!equipment) return res.status(404).send("Equipment not found");

        res.json(equipment);
    } catch(err) {
        res.status(500).send("Error fetching equipment details.");
    }
});

//registers a new user to the database
app.post('/register', async (req, res) => {
    const {username, firstName, lastName, email, phoneNumber, bio, password} = req.body;

    if(!username || !firstName || !email || !password) return res.status(400).send("Please fill out all required fields.");

    const userExists = await db.collection('users').findOne({
        username: username
    });
    const emailExists = await db.collection('users').findOne({
        email: email
    });

    if(emailExists) return res.status(400).send("Email already exists");
    if(userExists) return res.status(400).send("Username already exists.");

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

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await db.collection('users').findOne({username: username});

    if(!user) return res.status(400).send("Wrong username or password.");

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if(!isPasswordValid) return res.status(400).send("Wrong username or password");

    const token = jwt.sign(
        {
            userID: user._id,
            username: user.username
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: "1h"}
    );


    res.json({
        message: "Login successful",
        token: token
    });

});

app.get('/profile', authenticateToken,  async (req, res) => {
    try{
        const user = await db.collection('users').findOne({_id: new ObjectId(req.userID)});

        if(!user) return res.status(404).send("User not found.");

        res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            bio: user.bio,
            createdAt: user.createdAt
        });
    } catch(err) {
        res.status(500).send("Error getting profile.");
    }
});

connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
