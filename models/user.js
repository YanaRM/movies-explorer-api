const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: {
      value: true,
      message: 'Поле email является обязательным',
    },
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
    unique: true,
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле password является обязательным',
    },
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
