import { Router } from "express";
import { userController } from "../controllers/user-controller";
import tokenVerification from "../middleware/acces-token-middleware";
import specialRoleVerification from "../middleware/acces-special-roles-middleware"

export const router = Router();

router.get("/", (request, response) => {
  response.send("API работает нормально");
});

//Роутер входа в приложения (login)
router.post("/login", userController.login);

//Роутер выхода из приложения (logout)
router.post("/logout", tokenVerification, userController.logout);
//Ватоматический вход с использованием рефрештокена
router.post("/autologin", userController.autologin);

//Обновление токена
router.get("/refresh", userController.refresh);
//Получение данных о пользователе
router.get("/userInfo", tokenVerification, userController.getUserInfo);
//Получение списка пользователей
router.get("/users", tokenVerification, specialRoleVerification, userController.getUsersList);
