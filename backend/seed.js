const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const {MongoClient} = require('mongodb');

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME;

const eqipmentToSeed = [
    { name: 'Prusa MK4S', category: '3D Printer', description: 'Reliable 3D printer', price: 20, available: true, ownerId: 0 },
    { name: 'Bambu Lab X2D', category: '3D Printer', description: 'Prints items quickly', price: 25, available: true, ownerId: 0 },
    { name: 'Prusa Core One+', category: '3D Printer', description: 'Prints come out detailed and strong', price: 25, available: true, ownerId: 0 },
    { name: 'Creality SPARKX i7', category: '3D Printer', description: 'Easy to use and uses multi-color', price: 20, available: true, ownerId: 0 },
    { name: 'Anycubic Kobra X', category: '3D Printer', description: 'Cheap and has multi-color', price: 18, available: true, ownerId: 0 },
    { name: 'Canon EOS R50', category: 'Camera', description: 'Good entry level camera', price: 20, available: true, ownerId: 0 },
    { name: 'Sony Alpha ZV-E10 II', category: 'Camera', description: 'High performance camera', price: 25, available: true, ownerId: 0 },
    { name: 'Nikon Z 5 D Mark IV', category: 'Camera', description: 'Professional and mirrorless cammera', price: 28, available: true, ownerId: 0 },
    { name: 'Canon EOS Rebel T7', category: 'Camera', description: 'Cheap and durable camera.', price: 15, available: true, ownerId: 0 },
    { name: 'Soldering Kit', category: 'Soldering', description: 'Great for beginners', price: 10, available: true, ownerId: 0 },
    { name: 'Soldering Iron', category: 'Soldering', description: 'Does not come with other necessary tools', price: 5, available: true, ownerId: 0 },
    { name: 'Fume Extractor', category: 'Soldering', description: 'Filters well.', price: 3, available: true, ownerId: 0 },
    { name: 'Soldering Helping Hands', category: 'Soldering', description: 'Can hold up to 2 pounds', price: 2, available: true, ownerId: 0 },
    { name: 'Soldering Tip Cleaner', category: 'Soldering', description: 'Brand new.', price: 2, available: true, ownerId: 0 },
    { name: 'Jetson Nano', category: 'Computer', description: 'Computer that focuses on AI.', price: 30, available: true, ownerId: 0 },
    { name: 'Raspberry Pi 5', category: 'Computer', description: 'Latest Raspberry Pi.', price: 15, available: true, ownerId: 0 },
    { name: 'Raspberry Pi 4', category: 'Computer', description: 'Reliable Raspberry Pi.', price: 12, available: true, ownerId: 0 },
    { name: 'RX 7900 xt', category: 'Computer', description: 'Computer with a high performance AMD GPU', price: 20, available: true, ownerId: 0 },
    { name: 'RTX 5090', category: 'Computer', description: 'Computer that excels with ray tracing and AI.', price: 22, available: true, ownerId: 0 },

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