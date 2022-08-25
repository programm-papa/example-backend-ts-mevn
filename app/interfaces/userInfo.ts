import { Document, Types } from "mongoose";

export default interface IUserInfo extends Document {
    userId: Types.ObjectId,
    fullName: string,
    contactEmail: string,
    phone: string,
    dateBirth:string,
}