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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
// const { use } = require("passport");
const { userService } = require("../service/user-service");
exports.userController = {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body;
                const identificationData = yield userService.login(login, password);
                return res
                    .cookie("refreshToken", identificationData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                })
                    .status(200)
                    .json({
                    user: identificationData.user,
                    accessToken: identificationData.accessToken,
                    message: "Вы вошли в свой аккаунт",
                });
            }
            catch (e) {
                console.log(e);
                res.status(e.status).json({ errorType: e.errorType, message: e.message });
            }
        });
    },
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const result = yield userService.logout(refreshToken);
                if (result) {
                    return res.clearCookie("refreshToken").status(200).json({
                        message: "Вы вышли из своего аккаунта",
                    });
                }
                else {
                    return res.status(401).json({
                        message: "Не удалось выйти из аккаунта, попробуйте снова.",
                    });
                }
            }
            catch (e) {
                console.log(e);
                res.status(e.status).json({ errorType: e.errorType, message: e.message });
            }
        });
    },
    autologin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const identificationData = yield userService.autologin(refreshToken);
                res.cookie("refreshToken", identificationData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                return res
                    .status(200)
                    .json({
                    user: identificationData.user,
                    accessToken: identificationData.accessToken,
                    message: "Вы вошли в свой аккаунт",
                });
            }
            catch (e) {
                console.log(e);
                res.status(e.status).json({ errorType: e.errorType, message: e.message });
            }
        });
    },
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const identificationData = yield userService.refresh(refreshToken);
                res.cookie("refreshToken", identificationData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                return res
                    .status(200)
                    .json({
                    user: identificationData.user,
                    accessToken: identificationData.accessToken,
                    message: "Ваш токен изменён.",
                });
            }
            catch (e) {
                console.log(e);
                res.status(e.status).json({ errorType: e.errorType, message: e.message });
            }
        });
    },
    //Работа с пользователями
    getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield userService.getUserInfo(req.userData);
                return res
                    .status(200)
                    .json({
                    userInfo: info,
                    message: "Информация о пользователе получена",
                });
            }
            catch (e) {
                console.log(e);
                res.status(e.status).json({ errorType: e.errorType, message: e.message });
            }
        });
    },
    getUsersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersArrList = yield userService.getUsersList();
                return res
                    .status(200)
                    .json({ users: usersArrList, message: "Список пользователей получен" });
            }
            catch (e) {
                console.log(e);
                res.status(e.status).json({ errorType: e.errorType, message: e.message });
            }
        });
    },
};
