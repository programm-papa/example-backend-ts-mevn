"use strict";
// const dto = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDTO = void 0;
class userDTO {
    constructor(user) {
        this.id = user._id;
        this.login = user.username;
        this.region = user.region;
        let rolesArray = [];
        for (let i = 0; i < user.roles.length; i++) {
            rolesArray.push(user.roles[i].value);
        }
        this.roles = rolesArray;
    }
}
exports.userDTO = userDTO;
