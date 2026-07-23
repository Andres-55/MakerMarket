   const dns = require('dns');
   dns.setServers(['8.8.8.8', '8.8.4.4']);
   require('dotenv').config();

    const express = require('express');
    const cors = require('cors');
    const {MongoClient, ObjectId} = require('mongodb');

    const app = express();
    const port = process.env.PORT;

    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);

    const dbName = process.env.DB_NAME;

    let db;

    async function connectToDB() {
        try {
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

    // gets all the equipment from the data base
    app.get('/equipment', async(req, res) => {
        try {
            const equipment = await db.collection('equipment').find({}).toArray();
            res.json(equipment);
    } catch(err) {
            res.status(500).send('Error fetching equipment.');
    }
    });

    // gets the details from a specific equipment from the database
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
                .find({equipmentId: req.params.id})
                .sort({createdAt: -1})
                .toArray();
            res.json(reviews);
    } catch(err) {
            res.status(500).send('Error fetching reviews.');
    }
    });

    app.post('/equipment/:id/reviews', express.json(), async(req, res) => {
        try {
            const equipmentID = req.params.id;
            const userID = req.body.userID;
            const rating = req.body.rating;
            const comment = req.body.comment;

            const result = await db.collection('reviews').insertOne({
                equipmentId: equipmentID,
                userId: userID,
                rating: rating,
                comment: comment,
                createdAt: new Date()
        });

            res.status(201).json({_id: result.insertedId});
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
            const {name, email, phone, bio, avatarUrl} = req.body;

            await db.collection('users').updateOne(

            );

            res.sendStatus(200);
    } catch(err) {
            res.status(500).send('Error updating profile.');
    }
    });

    // gets a user's bookmarked equipment (full details, not just IDs)
    app.get('/users/:id/bookmarks', async(req, res) => {
        try {
            const bookmarks = await db.collection('bookmarks')
                .find({userId: req.params.id})
                .toArray();

            const equipmentIds = bookmarks.map(b => new ObjectId(b.equipmentId));

            const equipment = await db.collection('equipment')
                .find({_id: {$in: equipmentIds}})
                .toArray();

            res.json(equipment);
    } catch(err) {
            res.status(500).send('Error fetching bookmarks.');
    }
    });

    // adds a bookmark
    app.post('/bookmarks', express.json(), async(req, res) => {
        try {
            const {userId, equipmentId} = req.body;

            const existing = await db.collection('bookmarks').findOne({userId, equipmentId});
            if (existing) {
                return res.status(200).json(existing);
            }

            const result = await db.collection('bookmarks').insertOne({
                userId, equipmentId, createdAt: new Date()
        });
            res.status(201).json({_id: result.insertedId});
    } catch(err) {
            res.status(500).send('Error adding bookmark.');
    }
    });

    // removes a bookmark
    app.delete('/users/:userId/bookmarks/:equipmentId', async(req, res) => {
        try {
            await db.collection('bookmarks').deleteOne({
                userId: req.params.userId,
                equipmentId: req.params.equipmentId
        });
            res.sendStatus(200);
    } catch(err) {
            res.status(500).send('Error removing bookmark.');
    }
    });


    // rents a piece of equipment
    app.post('/rentals', express.json(), async(req, res) => {
        try {
            const {equipmentId, renterId, startDate, endDate} = req.body;

            const equipment = await db.collection('equipment').findOne({_id: new ObjectId(equipmentId)});
            if (!equipment) {
                return res.status(404).send("Equipment not found");
            }
            if (!equipment.available) {
                return res.status(400).send("Equipment is not available");
            }

            const result = await db.collection('rentals').insertOne({
                equipmentId,
                renterId,
                ownerId: equipment.ownerId,
                status: "active",
                startDate,
                endDate,
                createdAt: new Date()
            });

            await db.collection('equipment').updateOne(
                {_id: new ObjectId(equipmentId)},
                {$set: {available: false}}
            );

            res.status(201).json({_id: result.insertedId});
        } catch(err) {
            res.status(500).send('Error creating rental.');
        }
    });

    // marks a rental as completed (equipment returned)
    app.put('/rentals/:id/complete', async(req, res) => {
        try {
            const rental = await db.collection('rentals').findOne({_id: new ObjectId(req.params.id)});
            if (!rental) {
                return res.status(404).send("Rental not found");
            }

            await db.collection('rentals').updateOne(
                {_id: new ObjectId(req.params.id)},
                {$set: {status: "completed"}}
            );

            await db.collection('equipment').updateOne(
                {_id: new ObjectId(rental.equipmentId)},
                {$set: {available: true}}
            );

            res.sendStatus(200);
        } catch(err) {
            res.status(500).send('Error completing rental.');
        }
    });

    // gets equipment a user is currently renting (as the renter)
    app.get('/users/:id/rentals', async(req, res) => {
        try {
            const rentals = await db.collection('rentals')
                .find({renterId: req.params.id})
                .sort({createdAt: -1})
                .toArray();
            res.json(rentals);
        } catch(err) {
            res.status(500).send('Error fetching rentals.');
        }
    });

    // gets rentals for equipment a user owns (as the owner)
    app.get('/users/:id/rentals-owned', async(req, res) => {
        try {
            const rentals = await db.collection('rentals')
                .find({ownerId: req.params.id})
                .sort({createdAt: -1})
                .toArray();
            res.json(rentals);
        } catch(err) {
            res.status(500).send('Error fetching owned rentals.');
        }
    });

    connectToDB().then(() => {
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
    });
    });
