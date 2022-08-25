import User from "../models/user";
import IRole from "../interfaces/role";
import Role from "../models/role";

import generateError from "../exceptions/api-error";

import { tokenService } from "../service/token-service";
import { userDTO } from "../dtos";

export default async (req: any, res: any, next: any) => {
  try {
    if (!req.headers.authorization) {
      throw generateError.BadRequest(
        401,
        "unauthorizedError",
        "Неавторизованный запрос"
      );
    }
    const token = req.headers.authorization.split(" ")[1];
    const userData = await tokenService.validateAccessToken(token);
    if (!userData) {
      throw generateError.BadRequest(401, "expiredToken", "Токен устарел");
    }
    const user = await User.findOne({
      _id: userData.id,
    }).populate<{ roles: IRole[] }>({
      path: "roles",
      select: "value",
      model: Role,
    });
    //Проверка на существование пользователя
    if (!user) {
      throw generateError.BadRequest(
        401,
        "userNotFound",
        "Пользователь не найден"
      );
    }
    const dtoUserData: userDTO = new userDTO(user);
    req.userData = dtoUserData;
    next();
  } catch (err: any) {
    console.log(err);
    res
      .status(err.status)
      .json({ errorType: err.errorType, message: err.message });
  }
};
