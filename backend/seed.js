const {MongoClient} = require('mongodb');

const url = 'mongodb+srv://andressolorio48_db_user:kpyNK8oqlwBojCM8@makermarketdb.1igjx7c.mongodb.net/?appName=makerMarketDB';
const client = new MongoClient(url);
const dbName = 'makerMarketDB';

const eqipmentToSeed = [
    { name: 'Prusa MK4S', Category: '3D Printer', description: 'Reliable 3D printer', price: 20, available: true },
    { name: 'Canon EOS R50', Category: 'Camera', description: 'jdfkhgkjhkjg', price: 30, available: true },
    { name: 'Soldering Kit', Category: 'Soldering', description: 'gnfdkhkjdh', price: 10, available: true },
    { name: 'Jetson Nano', Category: 'Computer', description: 'Computer that focuses on AI.', price: 30, available: true }
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