import { Document, Types } from "mongoose";
import IRole from "./role";

export default interface IUser extends Document {
    email: string,
    username: string,
    password: string,
    region: string,
    //roles: mongoose.Types.DocumentArray<mongoose.Types.ObjectId>,
    roles: Types.DocumentArray<IRole>,
}