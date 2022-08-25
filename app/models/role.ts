import { Schema, model} from "mongoose"
import IRole from "../interfaces/role";

const roleSchema:Schema = new Schema({
    value: {
        type:String,
        unique: true,
        default: "USER"
    },
})

export default model<IRole>('Role', roleSchema);