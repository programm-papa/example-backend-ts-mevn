"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
    roles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Role" }],
});
userSchema.virtual("user_info", {
    ref: "UserInfo",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});
exports.default = (0, mongoose_1.model)("User", userSchema);
