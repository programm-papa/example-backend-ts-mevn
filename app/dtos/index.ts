// const dto = {};

// dto.user = (model) => {
//     let roles = [];
//     for (let i = 0; i < model.roles.length; i++) {
//         roles.push(model.roles[i].value);
//     }
//     return {
//         login: model.username,
//         id: model._id,
//         roles: roles,
//     }
// };

// module.exports = dto;
import IUserData from "../interfaces/userData";

export class userDTO implements IUserData {
  id: string;
  login: string;
  roles: string[];
  region: string;
  constructor(user: any) {
    this.id = user._id;
    this.login = user.username;
    this.region = user.region;
    this.roles = user.roles.map((role: any):string => role.value);
  }
}
