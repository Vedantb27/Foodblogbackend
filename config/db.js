require('dotenv').config();
const mongoose = require('mongoose');

const MONGOURL = process.env.MONGOURL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURL);
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
