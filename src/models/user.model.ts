import { model, Schema } from "mongoose";
import { aggregatePaginate, paginate } from "../utils/mongoose";


const schema = new Schema({
    uid: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        index: true,
        lowercase: true,
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'trainer', 'admin'],
        required: true,
    },
    image: String,
    address: String,
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },

    about: String,
   
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    experience: String,
  
}, { timestamps: true })

schema.plugin(paginate)
schema.plugin(aggregatePaginate)

const User = model('user', schema);
export default User;



// import mongoose, { Schema, Document, Model } from 'mongoose';

// interface IUser extends Document {
//     email: string;
//     password: string;
//     name: string;
//     lastLogin: Date;
//     isVerified: boolean;
//     role: 'admin' | 'seller' | 'user';
//     resetPasswordToken?: string;
//     resetPasswordExpiresAt?: Date;
//     verificationToken?: string;
//     verificationExpiresAt?: Date;
//     image?: string;
//     about?: string;
// }

// const userSchema: Schema<IUser> = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     lastLogin: { 
//         type: Date,
//         default: Date.now
//     },
//     isVerified: {
//         type: Boolean,
//         default: false
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'seller', 'user'],
//         default: 'user'
//     },
//     resetPasswordToken: String,
//     resetPasswordExpiresAt: Date,
//     verificationToken: String,
//     verificationExpiresAt: Date,
//     image: String,
//     about: String
// }, { timestamps: true });

// const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
// export default User;
// export type { IUser };
