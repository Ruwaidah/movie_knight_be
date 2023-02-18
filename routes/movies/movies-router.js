const axios = require("axios");
const { response } = require("express");
const router = require("express").Router();

router.get("/", async (req, res) => {
  // checkZip(req);

  // checkDate(req);
  const date = req.query.startDate;
  const zip = req.query.zip;

  axios
    .get(
      `http://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&zip=${zip}&api_key=${process.env.API_KEY}`
    )
    .then((movies) => {
      const length = movies.data.length;
      movies.data.map(async (movie, index) => {
        return await getingImag(movie.title, movie.releaseYear)
          .then((response) => {
            if (!response.data.Poster || response.data.Poster == "N/A") {
              movie.image =
                "https://res.cloudinary.com/donsjzduw/image/upload/v1580504817/hfjrl5wbkiugy4y0gmqu.jpg";
            } else {
              movie.image = response.data.Poster;
            }
            setTimeout(() => {
              if (index === length - 1) {
                res.status(200).json(movies.data);
              }
            }, 100);
          })
          .catch((err) => console.log("errororrs"));
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "error geting Data" });
    });
});

// Movie Details with TMDB API
router.get("/moviedetails/:movieId", (req, res) => {
  let title = req.params.movieId;
  if (title.includes(":")) title = title.split(":")[0];
  if (title.includes("(")) title = title.split("(")[0];
  console.log(title);
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_APIKEY}&query=${title}`
    )
    .then((respo) => {
      findVideos(respo.data.results[0].id).then((video) => {
        findCredits(respo.data.results[0].id).then((casts) => {
          const Directors = casts.data.crew.filter(
            (direct) =>
              (direct.department = "Directing" && direct.job == "Director")
          );
          movieById(respo.data.results[0].id).then((moviedetail) => {
            res.status(200).json({
              movie: respo.data.results[0],
              moviedetail: moviedetail.data,
              casts: [casts.data.cast.slice(0, 4)],
              directors: Directors,
              videos: video.data.results,
            });
          });
        });
      });
    });
});

module.exports = router;

const findVideos = (id) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_APIKEY}`
  );

const findCredits = (id) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_APIKEY}`
  );

const movieById = (id) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_APIKEY}`
  );

function getingImag(title, year) {
  if (title.includes(":")) title = title.split(":")[0];
  else if (title.includes("(")) title = title.split("(")[0];
  return axios.get(
    `http://www.omdbapi.com/?t=${title}&y=${year}&apikey=${process.env.OM_API_KEY}`
  );
}
