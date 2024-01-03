const Movie = require('../models/movie');
const { CREATED } = require('../utils/responseStatusCodes');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const {
  wrongData,
  movieNotFound,
  deletingMoviesForbidden,
  movieDeleted,
  validationError,
} = require('../utils/responseStatusMessages');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    year,
    country,
    director,
    description,
    duration,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    nameRU,
    nameEN,
    year,
    country,
    director,
    description,
    duration,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === validationError) {
        next(new BadRequestError(wrongData));

        return;
      }

      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFound);
      }

      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError(deletingMoviesForbidden);
      }

      return Movie.deleteOne(movie);
    })
    .then(() => res.send({ message: movieDeleted }))
    .catch(next);
};
