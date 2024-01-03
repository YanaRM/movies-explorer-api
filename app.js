require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {
  PORT,
  MONGO_URL,
  NODE_ENV,
  MONGO_URL_DEV,
} = require('./utils/processEnvConfig');
const router = require('./routes/index');
const limiter = require('./middlewares/limiter');
const corsHandler = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV);

app.use(helmet());
app.use(corsHandler);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
