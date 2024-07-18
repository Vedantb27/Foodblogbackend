const { MongoClient } = require('mongodb');

const URL = process.env.MONGOURL;
const client = new MongoClient(URL);
const dbName = "myDatabase";

let storedJsonData = {};

// Function to update JSON data
const updateJsonData = async (req, res) => {
    let data = req.body;

    if (Array.isArray(data) && data.length === 0) {
        data = [
            {
                "name": "New Category 1",
                "imageId": "",
                "items": []
            }
        ];
    }

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const db = client.db(dbName);
        const col = db.collection("myCollection");

        const newJsonObject = {};

        data.forEach((category) => {
            const categoryName = category.name;
            const categoryData = {
                imageId: category.imageId,
                items: category.items.map((item) => ({
                    cardId: item.cardId,
                    imageId: item.imageId,
                    title: item.title,
                    type: item.type,
                    mealDetail: item.mealDetail,
                    ingredients: item.ingredients,
                    youtubeUrl: item.youtubeUrl,
                })),
            };
            newJsonObject[categoryName] = categoryData;
        });

        let arrToObj = JSON.stringify(newJsonObject, null, 2);

        // Delete all documents in the collection
        await col.deleteMany({});

        // Insert the new JSON object
        const result = await col.insertOne(newJsonObject);
        console.log("Inserted new document with id:", result.insertedId);

        // Update the storedJsonData with the new JSON object
        storedJsonData = newJsonObject;

        res.status(200).send({ success: true, insertedId: result.insertedId });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send({ success: false, error: err.message });
    } finally {
        await client.close();
    }
};

// Function to get JSON data
const getJsonData = async (req, res) => {
    if (Object.keys(storedJsonData).length === 0) {
        try {
            console.log("Fetching JSON data from database...");
            await client.connect();
            console.log("Connected correctly to server");

            const db = client.db(dbName);
            const col = db.collection("myCollection");

            // Retrieve the current JSON object (assuming only one document is in the collection)
            const document = await col.findOne({});

            if (document) {
                storedJsonData = document;
                res.status(200).send(document);
                console.log("Response sent with database data");
            } else {
                res.status(404).send({ message: "No data found" });
            }
        } catch (err) {
            console.log(err.stack);
            res.status(500).send({ success: false, error: err.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(200).send(storedJsonData);
        console.log("Response sent with stored data");
    }
};

module.exports = {
    updateJsonData,
    getJsonData
};
