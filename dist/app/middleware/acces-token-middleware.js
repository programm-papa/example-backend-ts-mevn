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
const user_1 = __importDefault(require("../models/user"));
const role_1 = __importDefault(require("../models/role"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const token_service_1 = require("../service/token-service");
const dtos_1 = require("../dtos");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            throw api_error_1.default.BadRequest(401, "unauthorizedError", "Неавторизованный запрос");
        }
        const token = req.headers.authorization.split(" ")[1];
        const userData = yield token_service_1.tokenService.validateAccessToken(token);
        if (!userData) {
            throw api_error_1.default.BadRequest(401, "expiredToken", "Токен устарел");
        }
        const user = yield user_1.default.findOne({
            _id: userData.id,
        }).populate({
            path: "roles",
            select: "value",
            model: role_1.default,
        });
        //Проверка на существование пользователя
        if (!user) {
            throw api_error_1.default.BadRequest(401, "userNotFound", "Пользователь не найден");
        }
        const dtoUserData = new dtos_1.userDTO(user);
        req.userData = dtoUserData;
        next();
    }
    catch (err) {
        console.log(err);
        res
            .status(err.status)
            .json({ errorType: err.errorType, message: err.message });
    }
});
