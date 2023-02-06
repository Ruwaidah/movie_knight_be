const axios = require("axios");
const router = require("express").Router();



let theatersInfo = []
router.post("/", (req, res) => {
    let moviesAfterFilter = [];
    let results;
    let movieFilter = [];
    let dateToFilter = req.body.days.map(date => date[2])
    let i = 0;
    const timeFormat = timeFormatFun(req.body.times)
    let id;
    let title = '';
    getallmovies()
    function getallmovies() {
        setTimeout(() => {
            movieById(req.body.movies[i], req, 0, 3).then(response => {
                movieById(req.body.movies[i], req, 3, 4).then(response2 => {
                    if (response.data.length == 0 && response2.data.length == 0) { title = null; results = []; id = '' }
                    else if (response.data.length == 0 && response2.data.length > 0) {
                        id = response2.data[0].tmsId; title = response2.data[0].title;
                        movieFilter = filtering(response2.data[0].showtimes, timeFormat, dateToFilter)
                        results = filteDuplicate(movieFilter)
                    }
                    else if (response.data.length > 0 && response2.data.length == 0) {
                        id = response.data[0].tmsId; title = response.data[0].title;
                        movieFilter = filtering(response.data[0].showtimes, timeFormat, dateToFilter)
                        results = filteDuplicate(movieFilter)
                    }
                    else {
                        title = response2.data[0].title; id = response2.data[0].tmsId;
                        movieFilter = filtering([...response.data[0].showtimes, ...response2.data[0].showtimes], timeFormat, dateToFilter)
                        results = filteDuplicate(movieFilter);
                    }
                    moviesAfterFilter.push({ id: id, movie: title, showtimes: results })
                    if (i == req.body.movies.length - 1) res.status(200).json(moviesAfterFilter)
                    else { i++; getallmovies() }
                })
            }).catch(error => res.status(500).json({ message: "error geting Data" }))
        }, 1000)
    }
})


module.exports = router;


function movieById(id, req, days, number) {
    return axios.get(
        `http://data.tmsapi.com/v1.1/movies/${id}/showings?startDate=${getday(days)}&zip=${checkZip(req)}&radius=10&numDays=${number}&api_key=${process.env.API_KEY}`)
}


// Get Day By NAME
function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}




function filtering(data, times, dates) {
    console.log(data)
    let showTimefilterDate = data.filter(date => dates.includes(date.dateTime.split("T")[0]));
    showTimefilterDate = showTimefilterDate.filter(time => times.includes(Number(time.dateTime.split("T")[1].split(":")[0])))
    return showTimefilterDate
}


//  Date Format
function getday(number) {
    var day = new Date();
    day.setDate(day.getDate() + number);
    var dd = String(day.getDate()).padStart(2, "0");
    var mm = String(day.getMonth() + 1).padStart(2, "0");
    var yyyy = day.getFullYear();
    const fulldate = `${yyyy}-${mm}-${dd}`
    return fulldate;
}

function checkZip(req) {
    if (req.query && req.query.zip) return (zip = req.query.zip);
    else return (zip = "47712");
}

// CHANGE TIME DATA
function timeFormatFun(times) {
    let timeFormat = []
    times.map(time => {
        for (let i = 0; i < 3; i++) {
            if (time.includes("AM"))
                timeFormat.push(Number(time.split("-")[0]) + i)
            else if (time.includes("PM")) {
                if (time.split("-")[0] == 12)
                    timeFormat.push(Number(time.split("-")[0]) + i)
                else
                    timeFormat.push(Number(time.split("-")[0]) + i + 12)
            }
            else timeFormat.push(21 + i)
        }
    })
    return timeFormat
}


// FILTER DUPLICATE SHOWTIMES
function filteDuplicate(movies) {
    let alltheaters = [];
    let times;
    let address;
    let theatersName = movies.map(name => name.theatre.name)
    theatersName = removeDuplicateUsingSet(theatersName)

    let dates = removeDuplicateUsingSet(movies.map(date => date.dateTime.split("T")[0]))
    theatersName.map((theater) => {
        let showTimes = [];
        let dataForOneTheater = movies.filter(movie => movie.theatre.name == theater)
        for (let i = 0; i < dates.length; i++) {
            var dateStr = dates[i].replace("-", "/");
            var dayName = getDayName(dateStr, "en-US");
            times = dataForOneTheater.filter(info => info.dateTime.split("T")[0] == dates[i])
            let times1 = times.map(t => t.dateTime.split("T")[1])
            showTimes.push({ date: [dates[i], dayName], times: times1 })
        }
        return alltheaters.push({
            theatre: theater,
            id: dataForOneTheater[0].theatre.id,
            address: address,
            showtime: showTimes
        })
    })

    return (alltheaters)
}


// return Array With no Duplicate
function removeDuplicateUsingSet(arr) {
    let unique_array = Array.from(new Set(arr));
    return unique_array;
}

