const Movie = require('../models/movie');
const { CREATED } = require('../responseStatusCodes');
const { IncorrectData } = require('../errors/IncorrectData');
const { NotFound } = require('../errors/NotFound');
const { AccessDenied } = require('../errors/AccessDenied');

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
      if (err.name === 'ValidationError') {
        next(new IncorrectData('Неправильно введены данные'));

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
        throw new NotFound('Фильм не найден');
      }

      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new AccessDenied('Вы не можете удалять чужие фильмы');
      }

      return Movie.deleteOne(movie);
    })
    .then(() => res.send({ message: 'Фильм удалён' }))
    .catch(next);
};
