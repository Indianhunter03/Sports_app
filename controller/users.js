const User = require("../database/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_TOKEN;
const addUser = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const obj = { ...req.body, password: hash }
        const user = new User(obj);
        let result = await user.save();
        result = result.toObject();
        delete result.password
        jwt.sign({ result }, jwtKey, undefined, (err, token) => {
            res.send({ result, auth: token });
        })
    } catch (error) {
        res.send({ error: "exist" })
    }

}

const loginUser = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        const hash = await bcrypt.compare(req.body.password, user.password)
        user = user.toObject();
        delete user.password
        jwt.sign({ user }, jwtKey, undefined, (err, token) => {
            res.send({ user, auth: token });
        })
    } catch (error) {
        res.send({ error: "Wrong username or password" })
    }

}



module.exports = { addUser, loginUser };