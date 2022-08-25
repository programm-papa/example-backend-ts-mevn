// const mongoose = require('mongoose');
// import { Schema, Document, Types, model } from 'mongoose';
import { Schema, model, Types} from "mongoose"
import IToken from "../interfaces/token";


const tokenSchema:Schema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    refreshToken: {type: String, required: true},
}, {
    timestamps: true,
})

export default model<IToken>("Token", tokenSchema);