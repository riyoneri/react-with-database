const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const { v4: uuid } = require('uuid')
require('dotenv').config()

const mongoose = require('mongoose')

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {type: String, required: true},
    openingText: {type: String, required: true},
    releaseDate: {type: String, required: true},
}))

const app = express()

const databaseUrl = process.env.LOCAL_URL

app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get('/movies', (req, res, next) => {

    Movie.find()
        .sort({_id: -1})
        .then(movies => {
            res.status(200).json({
                movies: movies
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err: 'Internal Error'
            })
        })

})

app.post('/add-movie', (req, res, next) => {
    
    const movieData = new Movie(req.body)

    movieData.save()
        .then(movieData => {
            res.status(201).json({movieData})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err: 'Internal Error'
            })
        })

})

mongoose
    .connect(databaseUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        app.listen(8080, () => console.log("Listening"))
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })