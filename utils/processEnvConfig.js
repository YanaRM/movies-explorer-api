const {
  PORT = 3000,
  MONGO_URL,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

module.exports = {
  PORT,
  MONGO_URL,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL_DEV,
};
