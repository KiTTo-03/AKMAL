const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const port = 3000;

const app = express();
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

let db;

async function connectToMongoDB() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("taskAppDB");
    } catch (err) {
        console.error("Error:", err);
    }
}
connectToMongoDB();

// Parent Registration
app.post('/parents/register', async (req, res) => {
    try {
        const result = await db.collection('parents').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid registration data" });
    }
});

// Parent Login
app.post('/parents/login', async (req, res) => {
    try {
        const parent = await db.collection('parents').findOne(req.body);
        if (!parent) return res.status(401).json({ error: "Unauthorized" });
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(400).json({ error: "Login failed" });
    }
});

// Child Registration
app.post('/children/register', async (req, res) => {
    try {
        const result = await db.collection('children').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid registration data" });
    }
});

// Child Login
app.post('/children/login', async (req, res) => {
    try {
        const child = await db.collection('children').findOne(req.body);
        if (!child) return res.status(401).json({ error: "Unauthorized" });
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(400).json({ error: "Login failed" });
    }
});

// Add Task (Parent)
app.post('/tasks', async (req, res) => {
    try {
        const result = await db.collection('tasks').insertOne({
            ...req.body,
            completed: false,
            proofImage: null
        });
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid task data" });
    }
});

// View Tasks (Parent/Child)
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await db.collection('tasks').find().toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// Upload Proof to Complete Task (Child)
app.post('/tasks/:id/proof', upload.single('proofImage'), async (req, res) => {
    try {
        const result = await db.collection('tasks').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    completed: true,
                    proofImage: req.file.filename
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task completed with proof image" });
    } catch (err) {
        res.status(400).json({ error: "Error uploading proof" });
    }
});

// Admin Update (Mock Endpoint)
app.patch('/admin/update', async (req, res) => {
    // Mock admin action, no real functionality here
    res.status(200).json({ message: "App updated by admin" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});