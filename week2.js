
const { MongoClient } = require("mongodb");

const drivers = [
    {
        name: "AKMAL Doe",
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
    const url = "mongodb://localhost:27017";
    const client = new MongoClient(url);
  
    try {
        await client.connect();

        const db = client.db("testDB");

        const driversCollection = db.collection("drivers");

        drivers.forEach(async(driver)=>{
            const result = await driversCollection.insertOne(driver);
            console.log('New driver created with result: ${result}');
      });
  

    } finally {
        await client.close();
    }
}

// Execute the main function
  
// Execute the main function


// show the data in the console console.log(drivers);
// TODO: show the all the drivers name in the console
// TODO: add additional driver to the drivers array