import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import { router } from './app/router/index';


const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {config} = require('./config/index');
const {mongooseStatus} = require('./config/database');
const morgan = require('morgan');


//Константы для запуска web сервера
const PORT: string = process.env.PORT || "3001";
const app = express();


//Попытка подключения к базе данных
mongooseStatus(mongoose, config);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
  credentials: true,
  origin: '*'
}))
app.use('/api', router);

app.set('secretKey', config.secret);
app.set('specialSecretKey', config.secretSpecial);


//Запуск web сервера
const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => { console.log(`Server started on PORT = ${PORT}`); })
  } catch (e) {
    console.log(e);
  }
}

start();