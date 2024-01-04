const userRouter = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { updateUserInfoValidation } = require('../middlewares/validation');

userRouter.get('/me', auth, getUserInfo);

userRouter.patch('/me', auth, updateUserInfoValidation, updateUserInfo);

module.exports = userRouter;
