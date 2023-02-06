const router = require("express").Router();
const Users = require("./auth-model.js");
const restricted = require("./restricted-middleware.js")
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET
});

// Upload the Image
const imageupload = file => {
    return cloudinary.uploader.upload(file.image.tempFilePath, function (
        err,
        result
    ) {
        return result;
    });
};


// Post Image
router.post("/", (req, res) => {
    const checkUser = (data) => {
        if (data.googleId)
            return [
                { googleId: req.query.googleId },
                "oauth_consumer"
            ]
        else if (data.userId) {
            return [
                { id: req.query.userId },
                "consumer"
            ]
        }
    }
    checkUser(req.query)
    imageupload(req.files)
        .then(image => {
            Users.updateUser({ image: image.url }, checkUser(req.query)[1], checkUser(req.query)[0])
                .then(user => res.status(200).json(user))
                .catch(error => res.status(500).json({ message: "error update image" }))

        })
        .catch(error => console.log(error))
});





module.exports = router;