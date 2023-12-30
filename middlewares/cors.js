const allowedCors = [
  'http://movies-explorer-yanam.nomoredomainsmonster.ru',
  'https://movies-explorer-yanam.nomoredomainsmonster.ru',
  'http://api.movies-explorer-yanam.nomoredomainsmonster.ru',
  'https://api.movies-explorer-yanam.nomoredomainsmonster.ru',
  'http://localhost:3000',
];

const corsHandler = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  next();

  return true;
};

module.exports = corsHandler;
