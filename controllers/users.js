require('dotenv').config();
const bcrypt = require('bcrypt');

const { NODE_ENV, JWT_SECRET } = process.env;

const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { CREATED, MONGO_DUPLICATE_ERROR_CODE } = require('../responseStatusCodes');
const ExistingEmail = require('../errors/ExistingEmail');
const IncorrectData = require('../errors/IncorrectData');
const NotAuthenticate = require('../errors/NotAuthenticate');

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
        next(new ExistingEmail('Такой пользователь уже существует'));

        return;
      }

      if (err.name === 'ValidationError') {
        next(new IncorrectData('Неправильно введены данные'));

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
        return Promise.reject(new NotAuthenticate('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthenticate('Неправильные почта или пароль'));
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
      if (err.name === 'ValidationError') {
        next(new IncorrectData('Неправильно введены данные'));

        return;
      }

      next(err);
    });
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вызод из профиля выполнен успешно' });

  next();
};
