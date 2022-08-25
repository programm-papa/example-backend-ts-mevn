"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require('mongoose');
// import { Schema, Document, Types, model } from 'mongoose';
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Token", tokenSchema);
