const generateError = require('../exceptions/api-error');

import { userDTO } from "../dtos";

export default async (req: any, res: any, next: any) => {
    try {
        const userData: userDTO = req.userData
        if (userData.roles.includes('ADMIN') || userData.roles.includes('MANAGER')) {
            next();
        } else {
            throw generateError.BadRequest(401, 'reqError', 'У вас недостаточно прав для действия.');
        }

    } catch (err: any) {
        console.log(err);
        res.status(err.status).json({ errorType: err.errorType, message: err.message });
    }
}