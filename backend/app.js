require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { errorServer } = require('./middlewares/error');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      // 'https://mestomagnifico.nomoredomainsmonster.ru',
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use(requestLogger);

const { PORT = 3000 } = process.env;

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorServer);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT);
