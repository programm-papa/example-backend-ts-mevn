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
exports.userService = void 0;
const role_1 = __importDefault(require("../models/role"));
const user_1 = __importDefault(require("../models/user"));
const userInfo_1 = __importDefault(require("../models/userInfo"));
//working imports
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const dtos_1 = require("../dtos");
const bcrypt_1 = require("bcrypt");
const token_service_1 = require("./token-service");
exports.userService = {
    login(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({
                $or: [{ username: login }, { email: login }],
            }).populate({
                path: "roles",
                select: "value",
                model: role_1.default,
            });
            console.log(user);
            //Проверка на существование пользователя
            if (!user) {
                throw api_error_1.default.BadRequest(401, "userNotFound", "Пользователь не найден");
            }
            //Валидация пароля
            const isPassEquals = yield (0, bcrypt_1.compare)(password, user === null || user === void 0 ? void 0 : user.password);
            if (!isPassEquals) {
                throw api_error_1.default.BadRequest(401, "invalidPassword", "Неверный пароль");
            }
            const dtoUserData = new dtos_1.userDTO(user);
            const tokens = yield token_service_1.tokenService.generateTokens(Object.assign({}, dtoUserData));
            return Object.assign(Object.assign({}, tokens), { user: dtoUserData });
        });
    },
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield token_service_1.tokenService.removeToken(refreshToken);
            if (result) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    autologin(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_1.default.BadRequest(401, "unauthorizedError", "Неавторизованный пользователь");
            }
            const dtoUserData = yield token_service_1.tokenService.validateRefreshToken(refreshToken);
            const findTokenStatus = yield token_service_1.tokenService.findToken(refreshToken);
            if (!dtoUserData || !findTokenStatus) {
                throw api_error_1.default.BadRequest(401, "unauthorizedError", "Попробуйте войти снова.");
            }
            const tokens = yield token_service_1.tokenService.generateTokens(Object.assign({}, dtoUserData));
            return Object.assign(Object.assign({}, tokens), { user: dtoUserData });
        });
    },
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_1.default.BadRequest(401, "unauthorizedError", "Неавторизованный пользователь");
            }
            const dtoUserData = yield token_service_1.tokenService.validateRefreshToken(refreshToken);
            const findTokenStatus = yield token_service_1.tokenService.findToken(refreshToken);
            if (!dtoUserData || !findTokenStatus) {
                throw api_error_1.default.BadRequest(401, "unauthorizedError", "Попробуйте войти снова.");
            }
            const tokens = yield token_service_1.tokenService.generateTokens(Object.assign({}, dtoUserData));
            return Object.assign(Object.assign({}, tokens), { user: dtoUserData });
        });
    },
    getUserInfo(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield userInfo_1.default.findOne({
                    userId: userData.id,
                })
                    .select("-_id -__v")
                    .lean();
                if (info) {
                    return info;
                }
                else {
                    throw api_error_1.default.BadRequest(401, "getUserInfo", "Не удалось получить информацию о пользователе.");
                }
            }
            catch (err) {
                throw api_error_1.default.BadRequest(401, "getUserInfo", "Не удалось получить информацию о пользователе.");
            }
        });
    },
    getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userList = yield user_1.default.find({}, { email: 1, username: 1, roles: 1, region: 1, createdAt: 1 })
                    .populate({
                    path: "roles",
                    select: "value",
                    model: role_1.default,
                })
                    .populate({
                    path: "user_info",
                    model: userInfo_1.default,
                    select: "fullName contactEmail phone dateBirth -_id",
                })
                    .lean();
                console.log(userList[1]);
                // let dtoUserList = [];
                // for (i in userList) {
                //   const user = userList[i];
                //   dtoUserList[i] = {
                //     _id: user.id,
                //     email: user.email,
                //     username: user.username,
                //     roles: user.roles ? user.roles.map((e) => e.value) : "",
                //     region: user.region,
                //     user_info: user.user_info ? user.user_info : "",
                //     createdDate: user.createdAt,
                //   };
                // }
                // return dtoUserList;
                return {};
            }
            catch (err) {
                console.log(err);
                throw api_error_1.default.BadRequest(401, "getUsersList", "Не удалось получить список пользователя.");
            }
        });
    },
};
