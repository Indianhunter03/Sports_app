const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    myEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ],
    participated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ],
    pending: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ]
})

module.exports = mongoose.model("users", userSchema);