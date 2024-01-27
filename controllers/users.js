require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = require('../utils/processEnvConfig');

const saltRounds = 10;
const User = require('../models/user');

const { CREATED, MONGO_DUPLICATE_ERROR_CODE } = require('../utils/responseStatusCodes');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  userAlreadyExists,
  userNotFound,
  wrongData,
  wrongEmailOrPassword,
  successfulLogout,
  validationError,
} = require('../utils/responseStatusMessages');

module.exports.createNewUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res
        .status(CREATED)
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError(userAlreadyExists));

        return;
      }

      if (err.name === validationError) {
        next(new BadRequestError(wrongData));

        return;
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(wrongEmailOrPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(wrongEmailOrPassword));
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          return res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            })
            .send({
              _id: user._id,
              name: user.name,
              email: user.email,
            });
        });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequestError(userNotFound));
      }

      res.send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError(userAlreadyExists));

        return;
      }

      if (err.name === validationError) {
        next(new BadRequestError(wrongData));

        return;
      }

      next(err);
    });
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.send({ message: successfulLogout });

  next();
};
