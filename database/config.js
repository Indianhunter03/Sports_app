const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/SportsApp")

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected")
    } catch (error) {
        process.exit();
    }
}

module.exports = connectDb;