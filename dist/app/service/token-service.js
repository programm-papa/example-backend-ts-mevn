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
exports.tokenService = void 0;
const token_1 = __importDefault(require("../models/token"));
const jwt = require("jsonwebtoken");
const { config } = require("../../config/index");
exports.tokenService = {
    generateTokens(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jwt.sign(userData, config.secret, {
                expiresIn: "100m",
            });
            const refreshToken = jwt.sign(userData, config.secretSpecial, {
                expiresIn: "30d",
            });
            yield this.saveToken(userData, refreshToken);
            return {
                accessToken,
                refreshToken,
            };
        });
    },
    saveToken(user, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_1.default.findOne({ user: user.id });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                yield tokenData.save();
            }
            else {
                yield token_1.default.create({ user: user.id, refreshToken });
            }
        });
    },
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_1.default.deleteOne({ refreshToken });
            if (tokenData.deletedCount == 1) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    validateAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = jwt.verify(accessToken, config.secret);
                return {
                    login: userData.login,
                    id: userData.id,
                    roles: userData.roles,
                    region: userData.region,
                };
            }
            catch (e) {
                return null;
            }
        });
    },
    validateRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = jwt.verify(refreshToken, config.secretSpecial);
                return {
                    login: userData.login,
                    id: userData.id,
                    roles: userData.roles,
                    region: userData.region,
                };
            }
            catch (e) {
                return null;
            }
        });
    },
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_1.default.findOne({ refreshToken });
            if (tokenData) {
                return true;
            }
            else {
                return false;
            }
        });
    },
};
