const router = require("express").Router();
const bcrypt = require("bcryptjs");
const validateUser = require("./auth-helper.js");
const signToken = require("./generateToken.js")
const Users = require("./auth-model.js");
const restricted = require("./restricted-middleware.js")

router.post("/register", validateUser, (req, res) => {
  const user = ({ email, password, username } = req.body);
  user.password = bcrypt.hashSync(user.password, 8);
  Users.add(user, "consumer")
    .then(consumerreg => {
      res.status(201).json({
        user: {
          id: consumerreg.id,
          username: consumerreg.username,
          email: consumerreg.email,
          image: consumerreg.image,
          zipcode: consumerreg.zipcode
        },
        token: signToken(consumerreg)
      });
    })
    .catch(err => res.status(500).json({ message: "Error registering", error: err }));
});


router.post("/login", validateUser, (req, res) => {
  Users.findBy({ email: req.body.email }, "consumer")
    .then(consumer => {
      if (consumer && bcrypt.compareSync(req.body.password, consumer.password)) {
        res.status(200).json({
          token: signToken(consumer),
          user: {
            id: consumer.id,
            email: consumer.email,
            username: consumer.username,
            image: consumer.image,
            zipcode: consumer.zipcode,
            message: `Welcome ${consumer.email}!`
          }

        });
      } else res.status(401).json({ message: "Invalid Credentials" })
    })
    .catch(err => res.status(500).json({ message: "Login failed" }));
});


router.get("/:id", restricted, (req, res) => {
  Users.findBy({ id: req.params.id }, "consumer")
    .then(user => {
      if (user) {
        Users.findBytheater({ user_id: user.id })
          .then(theatres => {
            res.status(200).json({
              user: {
                id: user.id,
                username: user.username,
                emaill: user.email,
                image: user.image,
                zipcode: user.zipcode,
                theatres: theatres
              }
            })
          })
      } else res.status(401).json({ message: 'user not found' })
    })
    .catch(err => res.status(500).json({ message: "Error getting data" }));
})



// UPDATE USER
router.put("/:id", restricted, (req, res) => {
  Users.updateUser(req.body, "consumer", { id: req.params.id })
    .then(user => {
      if (user) {
        Users.findBytheater({ user_id: user.id })
          .then(theatres => {
            res.status(200).json({
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image: user.image,
                zipcode: user.zipcode,
                theatres: theatres
              }
            })
          })
      } else res.status(401).json({ message: 'user not found' })
    })
    .catch(err => res.status(500).json({ message: "Error getting data" }));
})




module.exports = router;

