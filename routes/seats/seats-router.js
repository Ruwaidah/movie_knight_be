const router = require("express").Router();
const Seats = require("./seats-model.js");

router.get("/", (req, res) => {
  Seats.getAll()
    .then(seats => res.status(200).json(seats))
    .catch(err => res.status(500).json({ error: "Error retrieving seats", error: err }))
}
);

module.exports = router;
