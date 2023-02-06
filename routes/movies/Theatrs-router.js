const axios = require("axios");
const router = require("express").Router();
// Coming Soon
router.post("/", (req, res) => {
    let i = 0;
    let theatres = []
    const noDuplicate = removeDuplicateUsingSet(req.body.theatres)
    gettheatre()
    function gettheatre() {
        setTimeout(() => {
            axios.get(`http://data.tmsapi.com/v1.1/theatres/${noDuplicate[i]}?api_key=${process.env.API_KEY}`)
                .then(response => {
                    theatres.push(response.data)
                    if (i == noDuplicate.length - 1)
                        res.status(200).json(theatres)
                    else {
                        i++;
                        gettheatre()
                    }
                }).catch(error =>
                    res.status(500).json({ message: "error geting Data" }))
        }, 1000)
    }
});



// return Array With no Duplicate
function removeDuplicateUsingSet(arr) {
    let unique_array = Array.from(new Set(arr));
    return unique_array;
}

module.exports = router