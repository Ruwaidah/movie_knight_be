const axios = require("axios");
const router = require("express").Router();
// Coming Soon
router.get("/", (req, res) => {
    axios
        .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_APIKEY}&language=en-US&page=1&region=us`)
        .then(response => {
            axios
                .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_APIKEY}&language=en-US&page=2&region=us`)
                .then(respon => res.status(200).json([response.data.results, respon.data.results]));
        })
        .catch(error => res.status(500).json({ message: "error geting Data" }));
});


module.exports = router