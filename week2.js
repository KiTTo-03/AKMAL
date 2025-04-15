
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
            console.log(`New driver created with result: ${result}`);
      });

      const availableDrivers = await db.collection('driver').find({
        isAvailable: true,
        rating: {$gte: 4.5}
      }).toArray();
      console.log("Available drivers:", availableDrivers);

      const updateResults = await db.collection('drivers').updateOne(
        {name: "AKMAL Doe"},
        {$inc: {rating:0.1}}
      );
      console.log(`driver updated with result: ${updateResults}`);

      const deleteResult= await db.collection('drivers').deleteOne({isAvailable: false});
      console.log(`driver deleted with result: ${deleteResult}`);

    } finally {
        await client.close();
    }
}

main();
// Execute the main function
  
// Execute the main function


// show the data in the console console.log(drivers);
// TODO: show the all the drivers name in the console
// TODO: add additional driver to the drivers array