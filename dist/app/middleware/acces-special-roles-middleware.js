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
const generateError = require('../exceptions/api-error');
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.userData;
        if (userData.roles.includes('ADMIN') || userData.roles.includes('MANAGER')) {
            next();
        }
        else {
            throw generateError.BadRequest(401, 'reqError', 'У вас недостаточно прав для действия.');
        }
    }
    catch (err) {
        console.log(err);
        res.status(err.status).json({ errorType: err.errorType, message: err.message });
    }
});
