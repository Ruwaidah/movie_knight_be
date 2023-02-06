const router = require("express").Router();
const Consumer = require("./auth-model.js");
const signToken = require("./generateToken.js")
const axios = require("axios")
const restricted = require("./restricted-middleware.js")


// Login With Google Oauth
router.post("/login", (req, res) => {
  axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${req.body.token}`)
    .then(response => {
      Consumer.findBy({ email: response.data.email }, "oauth_consumer")
        .then(consum => {
          if (!consum) {
            Consumer.add({ name: response.data.name, email: response.data.email, googleId: response.data.sub }, "oauth_consumer")
              .then(resp => res.status(201).json({ token: signToken(response.data), user: resp }))
              .catch(error => res.status(500).json({ message: "error adding data" }));
          }
          else res.status(200).json({ token: signToken(consum), user: consum });
        })
        .catch(error => res.status(500).json({ message: "error getting data" }));
    })
    .catch(error => res.status(401).json({ message: "invalid Token" }))
});



router.get("/:googleId", (req, res) => {
  console.log(req.params.googleId)
  Consumer.findBy({ googleId: req.params.googleId }, "oauth_consumer")
    .then(user => {
      console.log(user)
      if (user) {
        Consumer.findBytheater({ user_id: user.googleId })
          .then(theatres => {
            console.log(theatres)
            res.status(200).json({
              user: {
                id: user.id,
                googleId: user.googleId,
                name: user.name,
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



// UPDATE USER
router.put("/:googleId", restricted, (req, res) => {
  Consumer.updateUser(req.body, "oauth_consumer", { googleId: req.params.googleId })
    .then(user => {
      if (user) {
        Consumer.findBytheater({ user_id: user.id })
          .then(theatres => {
            res.status(200).json({
              user: {
                id: user.id,
                googleId: user.googleId,
                name: user.name,
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
