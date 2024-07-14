const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jsonRoutes = require('./routes/jsonRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000; // Default to 5000 if not set in .env

// Connect to MongoDB with Mongoose
connectDB();

let storedJsonData = {};
const URL = process.env.MONGOURL;
const client = new MongoClient(URL);
const dbName = "myDatabase";

// Fetch initial JSON data before handling any requests
const fetchInitialJsonData = async () => {
    try {
        console.log("Fetching initial JSON data...");
        await client.connect();
        console.log("Connected correctly to server");

        const db = client.db(dbName);
        const col = db.collection("myCollection");

        // Retrieve the current JSON object (assuming only one document is in the collection)
        const document = await col.findOne({});
        if (document) {
            storedJsonData = document;
            console.log("Initial JSON data fetched and stored:", storedJsonData);
        } else {
            console.log("No initial JSON data found");
        }
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
};

// Middleware to ensure data is loaded before handling requests
const ensureDataLoaded = async (req, res, next) => {
    if (Object.keys(storedJsonData).length === 0) {
        console.log("Stored data is empty, fetching data...");
        await fetchInitialJsonData();
    }
    next();
};

// Fetch initial data at server startup
fetchInitialJsonData().then(() => {
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/json', ensureDataLoaded, jsonRoutes);

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
