//Mongo and DB imports
import IRole from "../interfaces/role";
import IUser from "../interfaces/user";
import IUserInfo from "../interfaces/userInfo";
import Role from "../models/role";
import User from "../models/user";
import UserInfo from "../models/userInfo";

//working imports
import generateError from "../exceptions/api-error";
import { userDTO } from "../dtos";
import { compare } from "bcrypt";
import { tokenService } from "./token-service";

//interfaces import
import IIdentificationData from "../interfaces/identificationData";
import ITokensObject from "../interfaces/tokenObject";

export const userService = {
  async login(login: string, password: string): Promise<IIdentificationData> {
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    }).populate<{ roles: IRole[] }>({
      path: "roles",
      select: "value",
      model: Role,
    });
    console.log(user);
    //Проверка на существование пользователя
    if (!user) {
      throw generateError.BadRequest(
        401,
        "userNotFound",
        "Пользователь не найден"
      );
    }
    //Валидация пароля
    const isPassEquals: boolean = await compare(password, user?.password);
    if (!isPassEquals) {
      throw generateError.BadRequest(401, "invalidPassword", "Неверный пароль");
    }
    const dtoUserData: userDTO = new userDTO(user);
    const tokens: ITokensObject = await tokenService.generateTokens({
      ...dtoUserData,
    });
    return { ...tokens, user: dtoUserData };
  },
  async logout(refreshToken: string): Promise<boolean> {
    const result: boolean = await tokenService.removeToken(refreshToken);
    if (result) {
      return true;
    } else {
      return false;
    }
  },
  async autologin(refreshToken: string): Promise<IIdentificationData> {
    if (!refreshToken) {
      throw generateError.BadRequest(
        401,
        "unauthorizedError",
        "Неавторизованный пользователь"
      );
    }
    const dtoUserData: userDTO | null = await tokenService.validateRefreshToken(
      refreshToken
    );
    const findTokenStatus: boolean = await tokenService.findToken(refreshToken);

    if (!dtoUserData || !findTokenStatus) {
      throw generateError.BadRequest(
        401,
        "unauthorizedError",
        "Попробуйте войти снова."
      );
    }
    const tokens: ITokensObject = await tokenService.generateTokens({
      ...dtoUserData,
    });
    return { ...tokens, user: dtoUserData };
  },
  async refresh(refreshToken: string): Promise<IIdentificationData> {
    if (!refreshToken) {
      throw generateError.BadRequest(
        401,
        "unauthorizedError",
        "Неавторизованный пользователь"
      );
    }
    const dtoUserData: userDTO | null = await tokenService.validateRefreshToken(
      refreshToken
    );
    const findTokenStatus: boolean = await tokenService.findToken(refreshToken);

    if (!dtoUserData || !findTokenStatus) {
      throw generateError.BadRequest(
        401,
        "unauthorizedError",
        "Попробуйте войти снова."
      );
    }
    const tokens: ITokensObject = await tokenService.generateTokens({
      ...dtoUserData,
    });
    return { ...tokens, user: dtoUserData };
  },
  async getUserInfo(userData: userDTO): Promise<IUserInfo> {
    try {
      const info: IUserInfo | null = await UserInfo.findOne({
        userId: userData.id,
      })
        .select("-_id -__v")
        .lean();
      if (info) {
        return info;
      } else {
        throw generateError.BadRequest(
          401,
          "getUserInfo",
          "Не удалось получить информацию о пользователе."
        );
      }
    } catch (err) {
      throw generateError.BadRequest(
        401,
        "getUserInfo",
        "Не удалось получить информацию о пользователе."
      );
    }
  },
  async getUsersList(): Promise<any> {
    try {
      const userList:any = await User.find(
        {},
        { email: 1, username: 1, roles: 1, region: 1, createdAt: 1 }
      )
        .populate<{ roles: IRole[] }>({
          path: "roles",
          select: "value",
          model: Role,
        })
        .populate({
          path: "user_info",
          model: UserInfo,
          select: "fullName contactEmail phone dateBirth -_id",
        })
        .lean();
      console.log(userList[1].user_info);
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
    } catch (err) {
      console.log(err);
      throw generateError.BadRequest(
        401,
        "getUsersList",
        "Не удалось получить список пользователя."
      );
    }
  },
};
