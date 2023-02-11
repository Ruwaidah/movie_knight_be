const axios = require("axios");
const router = require("express").Router();

router.get("/", async (req, res) => {
  // checkZip(req);

  // checkDate(req);
  const date = req.query.startDate;
  const zip = req.query.zip;
  let allmymovies = [];

  axios
    .get(
      `http://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&zip=${zip}&api_key=${process.env.API_KEY}`
    )
    .then((movies) => {
      // const allMovies = await movies.data.map((movie) => {
      //   return { ...movie, [isActive]: false };
      // });
      // res.status(200).json(movies.data);
    const allMovies =   movies.data.map((movie) => {
        movie.isActive = false;
        Imagedata(movie.title, movie.releaseYear)
          .then((image) => {
            if (!image.data.Poster || image.data.Poster == "N/A") {
              movie.image =
                "https://res.cloudinary.com/donsjzduw/image/upload/v1580504817/hfjrl5wbkiugy4y0gmqu.jpg";
            } else {
              (movie.image = image.data.Poster),
                (movie.maturityRating = image.data.Ratings);
            }
            allmymovies.push(movie);
            console.log(allmymovies)
          })
          .catch((error) =>
            res.status(500).json({ message: "error geting Data" })
          );
        // console.log("data", data);

        // .then((res1) => {
        //   if (!res1.data.Poster || res1.data.Poster == "N/A") {
        //     movie.image =
        //       "https://res.cloudinary.com/donsjzduw/image/upload/v1580504817/hfjrl5wbkiugy4y0gmqu.jpg";
        //   } else {
        //     movie.image = res1.data.Poster;
        //     movie.maturityRating = res1.data.Ratings;
        //   }
        // })
        // .catch((error) =>
        //   res.status(500).json({ message: "error geting Data" })
        // );
        // return movie;
        // console.log("fhdfhdf", movie);
      });
      console.log("all,",allMovies)
      console.log("my",allmymovies);
      // res.status(200).json(allmymovies);
      // console.log(allmymovies)
    })
    .catch((error) => {
      res.status(500).json({ message: "error geting Data" });
    });
});

// Movie Details with TMDB API
router.post("/moviedetails", (req, res) => {
  let i = 1;
  let title = req.body.title;
  if (title.includes("(")) title = title.split("(")[0];

  searchMovieByTitle(title, i)
    .then((response) => {
      if (response.data.results.length <= 0 && i <= 5)
        return searchMovieByTitle(title, i++);
      findVideos(response.data.results[0].id).then((respo) => {
        findCredits(response.data.results[0].id).then((casts) => {
          const Directors = casts.data.crew.filter(
            (direct) =>
              (direct.department = "Directing" && direct.job == "Director")
          );
          movieById(response.data.results[0].id).then((moviedetail) => {
            res.status(200).json({
              movie: response.data.results[0],
              moviedetail: moviedetail.data,
              casts: [casts.data.cast.slice(0, 4)],
              directors: Directors,
              videos: respo.data.results,
            });
          });
        });
      });
    })
    .catch((error) => res.status(500).json({ message: "error geting Data" }));
});

module.exports = router;

// Get movie
const searchMovieByTitle = (title, number) =>
  axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_APIKEY}&language=en-US&query=${title}&page=${number}&include_adult=true`
  );

const findVideos = (id) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_APIKEY}&language=en-US`
  );

const findCredits = (id) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_APIKEY}`
  );

const movieById = (id) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_APIKEY}&language=en-US`
  );

// function checkZip(req) {
//   if (req.query && req.query.zip) return (zip = req.query.zip);
//   else return (zip = "47712");
// }

// function checkDate(req) {
//   var day = new Date();
//   var dd = String(day.getDate()).padStart(2, "0");
//   var mm = String(day.getMonth() + 1).padStart(2, "0");
//   var yyyy = day.getFullYear();
//   day = yyyy + "-" + mm + "-" + dd;
//   if (req.query && req.query.date) return (date = req.query.date);
//   else return (date = day);
// }

async function Imagedata(title, year) {
  if (title.includes(":")) title = title.split(":")[0];
  else if (title.includes("(")) title = title.split("(")[0];
  // else if (title == "The Gentlemen") year = 2019;
  // else if (title == "Las píldoras de mi novio")
  // title = "Las pildoras de mi novio";
  return await axios.get(
    `http://www.omdbapi.com/?t=${title}&y=${year}&apikey=${process.env.OM_API_KEY}`
  );
}
