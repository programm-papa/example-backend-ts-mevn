"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const acces_token_middleware_1 = __importDefault(require("../middleware/acces-token-middleware"));
const acces_special_roles_middleware_1 = __importDefault(require("../middleware/acces-special-roles-middleware"));
exports.router = (0, express_1.Router)();
exports.router.get("/", (request, response) => {
    response.send("API работает нормально");
});
//Роутер входа в приложения (login)
exports.router.post("/login", user_controller_1.userController.login);
//Роутер выхода из приложения (logout)
exports.router.post("/logout", acces_token_middleware_1.default, user_controller_1.userController.logout);
//Ватоматический вход с использованием рефрештокена
exports.router.post("/autologin", user_controller_1.userController.autologin);
//Обновление токена
exports.router.get("/refresh", user_controller_1.userController.refresh);
//Получение данных о пользователе
exports.router.get("/userInfo", acces_token_middleware_1.default, user_controller_1.userController.getUserInfo);
//Получение списка пользователей
exports.router.get("/users", acces_token_middleware_1.default, acces_special_roles_middleware_1.default, user_controller_1.userController.getUsersList);
