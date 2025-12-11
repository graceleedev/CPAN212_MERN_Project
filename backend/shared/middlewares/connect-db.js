const mongoose = require("mongoose");
const dburl = process.env.MONGODB_URI;

async function connectDB(req, res, next) {
    try {
        await mongoose.connect(dburl, {dbName: "RingoDB"})
        console.log("DB connected!");
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send("DB connection failed")        
    }
};

module.exports = connectDB;
