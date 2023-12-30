const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/NotFound');

const { createNewUser, login, logout } = require('../controllers/users');
const { createNewUserValidation, loginValidation } = require('../middlewares/validation');

router.post('/signup', createNewUserValidation, createNewUser);
router.post('/signin', loginValidation, login);
router.get('/signout', logout);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
