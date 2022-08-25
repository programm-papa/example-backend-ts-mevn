"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const index_1 = require("./app/router/index");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { config } = require('./config/index');
const { mongooseStatus } = require('./config/database');
const morgan = require('morgan');
//Константы для запуска web сервера
const PORT = process.env.PORT || "3001";
const app = (0, express_1.default)();
//Попытка подключения к базе данных
mongooseStatus(mongoose_1.default, config);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(passport_1.default.initialize());
app.use((0, cors_1.default)({
    credentials: true,
    origin: '*'
}));
app.use('/api', index_1.router);
app.set('secretKey', config.secret);
app.set('specialSecretKey', config.secretSpecial);
//Запуск web сервера
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(PORT, () => { console.log(`Server started on PORT = ${PORT}`); });
    }
    catch (e) {
        console.log(e);
    }
});
start();
