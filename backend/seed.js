const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const {MongoClient} = require('mongodb');

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME;

const eqipmentToSeed = [
    { name: 'Prusa MK4S', category: '3D Printer', description: 'Reliable 3D printer', price: 20, available: true, ownerId: 0 },
    { name: 'Canon EOS R50', category: 'Camera', description: 'jdfkhgkjhkjg', price: 30, available: true, ownerId: 0 },
    { name: 'Soldering Kit', category: 'Soldering', description: 'gnfdkhkjdh', price: 10, available: true, ownerId: 0 },
    { name: 'Jetson Nano', category: 'Computer', description: 'Computer that focuses on AI.', price: 30, available: true, ownerId: 0 }
];

async function runSeed() {
    try{ 
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('equipment');

        await collection.deleteMany({});
        await collection.insertMany(eqipmentToSeed);

        console.log("Successfully seeded the equipment collection.");
    } catch(err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

runSeed().catch(console.dir);