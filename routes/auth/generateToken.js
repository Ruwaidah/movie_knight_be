const jwt = require("jsonwebtoken");

const signToken = (user) =>
    jwt.sign({ username: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });


module.exports = signToken