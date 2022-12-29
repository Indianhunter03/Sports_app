// require("./database/config"); 
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("./database/config");
dotenv.config();
connectDb();
const { addUser, loginUser } = require("./controller/users");
const { addEvent, addParticipant, addPending, myEvents, getEvents, getSingleEvent, deletPending, searchEvents } = require("./controller/events");

const app = express();

app.use(express.json());
app.use(cors());

const jwtKey = process.env.JWT_TOKEN;



app.post("/register", addUser);
app.post("/login", loginUser);
app.post("/event/:id", verifyToken, addEvent);
app.get("/event/:id", verifyToken, getSingleEvent);

app.put("/participant/:id", verifyToken, addParticipant);

app.put("/pending/:id", verifyToken, addPending);

app.get("/myevents/:id", verifyToken, myEvents);
app.get("/events/:username", verifyToken, getEvents)
app.get("/events/:username/:key", verifyToken, searchEvents)

app.put("/remove/:id/:name", verifyToken, deletPending)

// deploment


const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running")
    })
}

// deployment
const PORT = process.env.PORT || 5000;

function verifyToken(req, resp, next) {
    let token = req.headers['authorization']

    if (token) {

        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.send({ result: "Please Provide Valid Token" })
            } else {
                next();
            }
        })
    } else {
        resp.send({ result: "Please add token with header" })
    }
}

app.listen(PORT, () => console.log("running 5000..."))