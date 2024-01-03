const { INTERNAL_SERVER_ERROR } = require('../utils/responseStatusCodes');

const serverErrorMessage = require('../utils/responseStatusMessages');

const errorHandler = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR
      ? serverErrorMessage
      : message,
  });

  next();
};

module.exports = errorHandler;
