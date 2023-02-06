const axios = require("axios");
const router = require("express").Router();

router.get("/", (req, res) => {
  checkZip(req);
  checkDate(req);
  axios
    .get(
      `http://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&zip=${zip}&api_key=${process.env.API_KEY}`
    )
    .then(movies => {
      let i = 0;
      imageLoop();
      function imageLoop() {
        // set timeout on each request beacuse some images were getting skipped and not showing
        setTimeout(() => {
          Imagedata(movies.data[i].title, movies.data[i].releaseYear)
            .then(res1 => {
              if (movies.data[i].title == "Las píldoras de mi novio")
                movies.data[i].image = "https://res.cloudinary.com/donsjzduw/image/upload/v1582262868/aty1hylgyzimcdbomgmc.jpg"
              else if (!res1.data.Poster || res1.data.Poster == "N/A") {
                movies.data[i].image =
                  "https://res.cloudinary.com/donsjzduw/image/upload/v1580504817/hfjrl5wbkiugy4y0gmqu.jpg";
              } else {
                movies.data[i].image = res1.data.Poster;
                movies.data[i].maturityRating = res1.data.Ratings;
              }
              if (i == movies.data.length - 1) {
                res.status(200).json(movies.data);
              } else {
                i++;
                imageLoop();
              }
            })
            .catch(error =>
              res.status(500).json({ message: "error geting Data" })
            );
        }, 1);
      }
    })

    .catch(error => res.status(500).json({ message: "error geting Data" }));
});

// Movie Details with TMDB API
router.post("/moviedetails", (req, res) => {
  let i = 1;
  let title = req.body.title;
  if (title.includes("(")) title = title.split("(")[0];

  searchMovieByTitle(title, i)
    .then(response => {
      if (response.data.results.length <= 0 && i <= 5) return searchMovieByTitle(title, i++);
      findVideos(response.data.results[0].id)
        .then(respo => {
          findCredits(response.data.results[0].id)
            .then(casts => {
              const Directors = casts.data.crew.filter(
                direct => (direct.department = "Directing" && direct.job == "Director"));
              movieById(response.data.results[0].id)
                .then(moviedetail => {
                  res.status(200).json({
                    movie: response.data.results[0],
                    moviedetail: moviedetail.data,
                    casts: [casts.data.cast.slice(0, 4)],
                    directors: Directors,
                    videos: respo.data.results
                  });
                })
            })
        })
    }).catch(error => res.status(500).json({ message: "error geting Data" }));
});

module.exports = router;

// Get movie
const searchMovieByTitle = (title, number) =>
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_APIKEY}&language=en-US&query=${title}&page=${number}&include_adult=true`)

const findVideos = (id) =>
  axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_APIKEY}&language=en-US`)

const findCredits = (id) =>
  axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_APIKEY}`)

const movieById = (id) =>
  axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_APIKEY}&language=en-US`)


function checkZip(req) {
  if (req.query && req.query.zip) return (zip = req.query.zip);
  else return (zip = "47712");
}

function checkDate(req) {
  var day = new Date();
  var dd = String(day.getDate()).padStart(2, "0");
  var mm = String(day.getMonth() + 1).padStart(2, "0");
  var yyyy = day.getFullYear();
  day = yyyy + "-" + mm + "-" + dd;
  if (req.query && req.query.date) return (date = req.query.date);
  else return (date = day);
}

function Imagedata(title, year) {
  if (title.includes(":"))
    title = title.split(":")[0];

  else if (title.includes("("))
    title = title.split("(")[0];

  else if (title == "The Gentlemen")
    year = 2019;

  else if (title == "Las píldoras de mi novio")
    title = "Las pildoras de mi novio"

  return axios.get(
    `http://www.omdbapi.com/?t=${title}&y=${year}&apikey=${process.env.OM_API_KEY}`
  );
}