import { userDTO } from "../dtos";
import ITokensObject from "./tokenObject";

export default interface IIdentificationData extends ITokensObject {
    user: userDTO;
}