import {model, Schema} from "mongoose";

interface OtpI {
    action:String,
    email:String,
    phone:String,
    otp:String,
    expireAt:Date,
}
let schema = new Schema<OtpI>({
    action: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    otp: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: {expires: '2m'},
    },
}, {timestamps: true})

const Otp = model<OtpI>('otp', schema);
export default Otp;