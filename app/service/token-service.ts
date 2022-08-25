//Mongo and DB imports
import IToken from "../interfaces/token";
import Token from "../models/token";
import IRole from "../interfaces/role";
import Role from "../models/role";
import User from "../models/user";

//working imports
import { userDTO } from "../dtos";
const jwt = require("jsonwebtoken");
const { config } = require("../../config/index");

//interfaces import
import ITokensObject from "../interfaces/tokenObject";
import IUserData from "../interfaces/userData";

export const tokenService = {
  async generateTokens(userData: userDTO): Promise<ITokensObject> {
    const accessToken: string = jwt.sign(userData, config.secret, {
      expiresIn: "100m",
    });
    const refreshToken: string = jwt.sign(userData, config.secretSpecial, {
      expiresIn: "30d",
    });
    await this.saveToken(userData, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  },
  async saveToken(user: userDTO, refreshToken: string): Promise<void> {
    const tokenData: IToken | null = await Token.findOne({ user: user.id });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    } else {
      await Token.create({ user: user.id, refreshToken });
    }
  },
  async removeToken(refreshToken: string): Promise<boolean> {
    const tokenData = await Token.deleteOne({ refreshToken });
    if (tokenData.deletedCount == 1) {
      return true;
    } else {
      return false;
    }
  },
  async validateAccessToken(accessToken: string): Promise<IUserData | null> {
    try {
      let userData = jwt.verify(accessToken, config.secret);
      return {
        login: userData.login,
        id: userData.id,
        roles: userData.roles,
        region: userData.region,
      };
    } catch (e) {
      return null;
    }
  },
  async validateRefreshToken(refreshToken: string): Promise<IUserData | null> {
    try {
      let userData = jwt.verify(refreshToken, config.secretSpecial);
      return {
        login: userData.login,
        id: userData.id,
        roles: userData.roles,
        region: userData.region,
      };
    } catch (e) {
      return null;
    }
  },
  async findToken(refreshToken: string): Promise<boolean> {
    const tokenData: IToken | null = await Token.findOne({ refreshToken });
    if (tokenData) {
      return true;
    } else {
      return false;
    }
  },
};
