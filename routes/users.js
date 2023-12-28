const userRouter = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { updateUserInfoValidation } = require('../middlewares/validation');

userRouter.get('/users/me', auth, getUserInfo);

userRouter.patch('/users/me', auth, updateUserInfoValidation, updateUserInfo);

module.exports = userRouter;
