// const { body } = require("express-validator");
// import { tokenService } from "../service/token-service";
// import { userDTO } from "../dtos";
import IIdentificationData from "../interfaces/identificationData";
import IUserInfo from "../interfaces/userInfo";

// const { use } = require("passport");
const { userService } = require("../service/user-service");

export const userController = {
  async login(req: any, res: any): Promise<any> {
    try {
      const { login, password } = req.body;
      const identificationData: IIdentificationData = await userService.login(
        login,
        password
      );
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
    } catch (e: any) {
      console.log(e);
      res.status(e.status).json({ errorType: e.errorType, message: e.message });
    }
  },
  async logout(req: any, res: any): Promise<any> {
    try {
      const { refreshToken } = req.cookies;
      const result: boolean = await userService.logout(refreshToken);
      if (result) {
        return res.clearCookie("refreshToken").status(200).json({
          message: "Вы вышли из своего аккаунта",
        });
      } else {
        return res.status(401).json({
          message: "Не удалось выйти из аккаунта, попробуйте снова.",
        });
      }
    } catch (e: any) {
      console.log(e);
      res.status(e.status).json({ errorType: e.errorType, message: e.message });
    }
  },
  async autologin(req: any, res: any): Promise<any> {
    try {
      const { refreshToken } = req.cookies;
      const identificationData: IIdentificationData =
        await userService.autologin(refreshToken);
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
    } catch (e: any) {
      console.log(e);
      res.status(e.status).json({ errorType: e.errorType, message: e.message });
    }
  },
  async refresh(req: any, res: any): Promise<any> {
    try {
      const { refreshToken } = req.cookies;
      const identificationData: IIdentificationData =
        await userService.refresh(refreshToken);
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
    } catch (e: any) {
      console.log(e);
      res.status(e.status).json({ errorType: e.errorType, message: e.message });
    }
  },

  //Работа с пользователями
  async getUserInfo (req: any, res: any) {
    try {
      const info: IUserInfo = await userService.getUserInfo(req.userData);
      return res
        .status(200)
        .json({
          userInfo: info,
          message: "Информация о пользователе получена",
        });
    } catch (e: any) {
      console.log(e);
      res.status(e.status).json({ errorType: e.errorType, message: e.message });
    }
  },
  async getUsersList (req: any, res: any): Promise<any>   {
    try {
      const usersArrList = await userService.getUsersList();
      return res
        .status(200)
        .json({ users: usersArrList, message: "Список пользователей получен" });
    }  catch (e: any) {
      console.log(e);
      res.status(e.status).json({ errorType: e.errorType, message: e.message });
    }
  },
  
};
