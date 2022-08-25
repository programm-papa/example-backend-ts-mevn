import { Document, Types } from "mongoose";

export default interface IToken extends Document {
    user: Types.ObjectId,
    refreshToken: string,
}