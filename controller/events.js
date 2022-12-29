const Event = require("../database/eventModel");
const User = require("../database/userModel");
const images = {
    cricket: "https://wallpaperaccess.com/full/1088580.jpg",
    volleyball: "https://media.istockphoto.com/id/481671830/photo/friends-playing-volleyball.jpg?s=612x612&w=0&k=20&c=GBLfoCDmFV5JzLWOJ9YTXzqJ97q0npBnAIIklpZuoZc=",
    badminton: "https://us.123rf.com/450wm/noprati/noprati2205/noprati220500001/noprati220500001.jpg?ver=6",
    football: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTVyQQaPPQ_j9FIUtPzOIWm6-fA6nJHKd-ClMOWvAyO-Iyg7INOeYyn65tLuFcI24zMY&usqp=CAU",
    bascketball: "https://wallpaperaccess.com/full/720058.jpg"
}
const addEvent = async (req, res) => {
    const id = req.params.id;
    const obj = { ...req.body, image: images[req.body.eventName] }
    const event = new Event(obj);
    let result = await event.save();

    await User.findOneAndUpdate({ username: result.createdBy }, { $push: { myEvents: result._id } });

    if (result.eventName) {
        res.send(result)
    } else {
        throw new Error("username already available");
    }
}

const addParticipant = async (req, res) => {
    const id = req.params.id;
    console.log(id, req.body.name)
    const result = await Event.findOne({ _id: id });
    result.currentParticipants.push(req.body.name);
    result.save();

    await User.findOneAndUpdate({ username: req.body.name }, { $push: { participated: result._id } });
    res.send(result);
}

const getSingleEvent = async (req, res) => {
    const id = req.params.id;
    const result = await Event.findOne({ _id: id });
    res.send(result);
}

const addPending = async (req, res) => {
    const id = req.params.id;
    const result = await Event.findOne({ _id: id });
    result.pending.push(req.body.name);
    result.save()

    await User.findOneAndUpdate({ username: req.body.name }, { $push: { pending: result._id } });

    res.send(result);
}

const myEvents = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).populate("myEvents").populate("participated").populate("pending");
    res.send(user);
}

const getEvents = async (req, res) => {
    const username = req.params.username;
    const event = await Event.find({ createdBy: { $nin: username } });
    res.send(event);
}

const deletPending = async (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    const event = await Event.updateOne({ _id: id },
        {
            $pull: { pending: name }
        }
    )

    await User.findOneAndUpdate({ username: name }, { $pull: { pending: id } });

    res.send(event);
}

const searchEvents = async (req, res) => {
    const username = req.params.username;
    const key = req.params.key;
    const event = await Event.find({
        "$and": [{ createdBy: { $nin: username } },
        {
            "$or": [
                { eventName: { $regex: key, $options: "i" } },
                { createdBy: { $regex: key, $options: "i" } },
            ]
        }]
    });
    res.send(event);
}

module.exports = { addEvent, addParticipant, addPending, myEvents, getEvents, deletPending, searchEvents, getSingleEvent }