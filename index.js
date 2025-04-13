
const { MongoClient } = require("mongodb");

const drivers = [
    {
        name: "John Doe",
        vehicleType: "Sedan",
        isAvailable: true, rating: 4.8
    },
    {
        name: "Alice Smith",
        vehicleType: "SUV",
        isAvailable: false, rating: 4.5
    }
];

console.log(drivers);

async function main() {
    // MongoDB connection string
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        
        const db = client.db("testDB");
        const collection = db.collection("users");

        // Insert a document
        const insertResult = await collection.insertOne({
            name: "Alice",
            age: 25
        });
        console.log("Document inserted!");

        // Query the document
        const result = await collection.findOne({
            name: "Alice"
        });
        console.log("Query result:", result);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

// Execute the main function
main().catch(console.error);

// show the data in the console console.log(drivers);
// TODO: show the all the drivers name in the console
// TODO: add additional driver to the drivers array