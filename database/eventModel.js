const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true,
        trim: true
    },
    createdBy: {
        type: String,
        require: true,
        trim: true
    },
    totalSeats: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    currentParticipants: [String],
    pending: [String]
})

module.exports = mongoose.model("events", eventSchema);