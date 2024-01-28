const movieRouter = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const auth = require('../middlewares/auth');
const { createMovieValidation, movieIdValidation } = require('../middlewares/validation');

movieRouter.get('/', auth, getSavedMovies);

movieRouter.post('/', auth, createMovie);

movieRouter.delete('/:_id', auth, movieIdValidation, deleteMovie);

module.exports = movieRouter;
