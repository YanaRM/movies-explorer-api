const movieRouter = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const auth = require('../middlewares/auth');
const { createMovieValidation, movieIdValidation } = require('../middlewares/validation');

movieRouter.get('/movies', auth, getSavedMovies);

movieRouter.post('/movies', auth, createMovieValidation, createMovie);

movieRouter.delete('/movies/:_id', auth, movieIdValidation, deleteMovie);

module.exports = movieRouter;
