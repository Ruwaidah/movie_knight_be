const router = require("express").Router();
const validateUser = require("./auth-helper.js");
const Users = require("./auth-model.js");
const restricted = require("./restricted-middleware.js")



router.post("/", (req, res) => {
    console.log(req.body)
    console.log(req.query)
    let user;
    let data = req.body[0].location.address
    if (req.query.googleId) {
        user = req.query.googleId
    }

    else if (req.query.userId) {
        user = req.query.userId;
    }
    if (req.body) {
        let theatre = {
            theatreId: req.body[0].theatreId,
            theatre: req.body[0].name,
            street: data.street,
            state: data.state,
            city: data.city,
            zip: data.postalCode,
            user_id: user,
        }
        Users.add(theatre, "favoriteTheatre")
            .then(response => res.status(201).json({ message: "added to user" }))
            .catch(error => res.status(500).json({ message: "error in server" }))
    }
    else res.status(401).json({ message: "missing theatre" })
})


router.get("/", (req, res) => {
    let user;
    if (req.query.googleId) {
        user = {
            oauth_id: req.query.googleId
        }
    }
    else if (req.query.userId) {
        user = { user_id: req.query.userId }
    }
    Users.findBytheater(user)
        .then(response => res.status(201).json(response))
        .catch(error => res.status(500).json({ message: "error in server" }))


})



router.delete("/", (req, res) => {
    let tb = "favoriteTheatre"
    let data = { user_id: req.query.userid, theatreId: req.query.theaterid }
    Users.deleteData(data, tb)
        .then(response => res.status(200).json({ message: "deleted" }))
        .catch(err => res.status(401).json({ message: "error in server" }))
})

module.exports = router;
