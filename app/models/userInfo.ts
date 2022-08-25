import { Schema, model } from "mongoose";
import IUserRole from "../interfaces/userInfo";

const userInfoSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: {
        type: String,
        default: "",
    },
    contactEmail: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    dateBirth: {
        type: String,
        default: "",
    },
});

export default model<IUserRole>("UserInfo", userInfoSchema);
