const router = require('express').Router();
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

const { createNewUser, login, logout } = require('../controllers/users');
const { createNewUserValidation, loginValidation } = require('../middlewares/validation');

const { pageNotFound } = require('../utils/responseStatusMessages');

router.post('/signup', createNewUserValidation, createNewUser);
router.post('/signin', loginValidation, login);
router.post('/signout', auth, logout);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError(pageNotFound));
});

module.exports = router;
