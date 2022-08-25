import { Schema, model } from "mongoose";
import IToken from "../interfaces/token";
import IUser from "../interfaces/user";

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
});

userSchema.virtual("user_info", {
  ref: "UserInfo",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

export default model<IUser>("User", userSchema);
