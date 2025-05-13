import User from "../models/user.model"
import {numberGen,generateUid} from "../helper/helper";
import bcrypt from "bcrypt";
import Otp from "../models/otp.model";
import jwt from 'jsonwebtoken';
// import config from '../config/config';
const secret = process.env.SECRET || 'defaultSecret';
export const findUser = async (req: any, res : any) => {
    try {
        const query = req.query;
        let find = await User.findOne(query);
        return res.status(200).json({
            error: false,
            msg: !find ? 'Account not found' : 'Account found',
            data: {
                account: !!find,
                role: find?.role,
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}


export const sendOtp = async (req: any, res : any) => {
    try {
        let body = req.body
        let otp = await numberGen();
        let find = await User.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
        })
        if (body.action === 'registration' && !!find) {
            return res.status(400).send({
                error: true,
                msg: 'Account already registered'
            })
        }
        if (body.action !== 'registration' && !find) {
            return res.status(400).send({
                error: true,
                msg: 'Account not found'
            })
        }
        if (!!body.phone) {
            let find = await Otp.findOne({ phone: body.phone, action: body.action })
            if (!!find) {
                return res.status(400).send({
                    error: true,
                    msg: 'Verification code already send. Try again later'
                })
            }
            await Otp.create({
                phone: body.phone,
                action: body.action,
                otp: otp
            });
            // await sendUserPhone({
            //     phone: body.phone,
            //     message: `Your verification code is ${otp}`
            // });

        }
        if (!!body.email) {
            let find = await Otp.findOne({ email: body.email, action: body.action })
            if (!!find) {
                return res.status(400).send({
                    error: true,
                    msg: 'Verification code already send. Try again later'
                })
            }
            await Otp.create({
                email: body.email,
                action: body.action,
                otp: otp
            })
            // await sendEmail(
            //     {
            //         email: body.email,
            //         subject: 'Verification Code',
            //         message: `Your verification code is ${otp}`
            //     }
            // )
        }
        return res.status(200).send({
            error: false,
            msg: 'OTP sent successfully',
            data: otp,
        })
    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}
// export const userRegistration = async (req: any, res : any) => {
//     const uid = await generateUid('U-', User);
//     try {
//         const body = req.body;
//         let query = {}
//         const otp = await Otp.findOne({
//             [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
//             action: body.action,
//         });
//         const comTime = new Date(otp?.createdAt).getDate() * 2 * 60 * 1000 < new Date(otp?.createdAt).getDate();
//         if (!otp || otp["otp"] !== body.otp || comTime || body.action != "registration") {
//             return res.status(400).send({
//                 error: true,
//                 msg: 'Invalid verification code'
//             })
//         }
//         if (!!body?.phone && !!body?.email) {
//             query = {
//                 $or: [
//                     { phone: body.phone },
//                     { email: body.email }
//                 ]
//             }
//         } else {
//             query = {
//                 [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
//             }
//         }

//         let find = await User.findOne(query);
//         if (!!find) {
//             return res.status(400).send({
//                 error: true,
//                 msg: 'User already registered'
//             })
//         }

//         const newUser: { uid: string; name: any; password: string; role: any; phone?: string; email?: string } = {
//             uid: uid,
//             name: body.name,
//             password: bcrypt.hashSync(body.password, 8),
//             role: body.role || 'user',
//         }
//         if (!!body.phone) newUser['phone'] = body.phone;
//         if (!!body.email) newUser['email'] = body.email;

//         // if (body.role === 'employee' && body.permission) {
//         //     newUser['permission'] = body.permission;
//         // }
//         let user = await User.create(newUser);
//         return res.status(200).send({
//             error: false,
//             msg: 'User registered successfully',
//             data: {
//                 role: user?.role,
//             }
//         })
//     } catch (error) {
//         return res.status(500).send({
//             error: true,
//             msg: 'Internal server error'
//         })
//     }


// }

export const userRegistration = async (req: any, res: any) => {
    const uid = await generateUid('U-', User);
    try {
        const body = req.body;
        console.log('Registration request body:', body); // Log request body

        let query = {};
        const otp = await Otp.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
            action: body.action,
        });
        const comTime = new Date(otp?.createdAt).getDate() * 2 * 60 * 1000 < new Date(otp?.createdAt).getDate();
        if (!otp || otp["otp"] !== body.otp || comTime || body.action != "registration") {
            return res.status(400).send({
                error: true,
                msg: 'Invalid verification code'
            });
        }
        if (!!body?.phone && !!body?.email) {
            query = {
                $or: [
                    { phone: body.phone },
                    { email: body.email }
                ]
            };
        } else {
            query = {
                [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
            };
        }

        let find = await User.findOne(query);
        if (!!find) {
            return res.status(400).send({
                error: true,
                msg: 'User already registered'
            });
        }

        const newUser: { uid: string; name: any; password: string; role: any; phone?: string; email?: string } = {
            uid: uid,
            name: body.name,
            password: bcrypt.hashSync(body.password, 8),
            role: body.role || 'user',
        };
        if (!!body.phone) newUser['phone'] = body.phone;
        if (!!body.email) newUser['email'] = body.email;

        console.log('New user to be created:', newUser); // Log new user object

        let user = await User.create(newUser);
        return res.status(200).send({
            error: false,
            msg: 'User registered successfully',
            data: {
                role: user?.role,
            }
        });
    } catch (error) {
        console.error('Registration error:', error); // Log error
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
};

export const userLogin = async (req: any, res: any) => {
    try {
        let body = req.body
        let user: any = await User.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
        });
        if (!user || !bcrypt.compareSync(body.password, user?.password)) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid credentials'
            })
        }
        jwt.sign({ _id: user?._id, uid: user?.uid, role: user?.role, status: user?.status }, secret, {}, (error, token) => {
            if (!error) {
                return res.cookie('token', token, {
                    expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }).status(200).json({
                    error: false,
                    msg: 'Login successful',
                    data: {
                        role: user?.role,
                    }
                })
            }
            return res.status(400).send({
                error: true,
                msg: 'There is somthing wrong'
            })
        })

    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const userLogout = async (req: any, res: any) => {
    try {
        return res.clearCookie('token').status(200).send({
            error: false,
            msg: 'Logout successfully'
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

export const getUserProfile = async (req: any, res: any) => {
    try {
        let user = res.locals?.user;
        const data = await User.findById(user._id).select("-password -__v").lean();
        // const user = req.user;
       if (!!data){
        return res.status(200).json({
            msg: "User found successfully",
            data,
            error: false
        })
       }
       return res.status(400).json({
        msg: "User not found",
        error: true
    })
    } catch (err) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}

// export const userLogin = async (req: any, res: any) => {
//     try {
//         let body = req.body;
//         console.log('Login request body:', body); // Log request body

//         let user: any = await User.findOne({
//             [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email,
//         });
//         console.log('User found:', user); // Log user found

//         if (!user || !bcrypt.compareSync(body.password, user?.password)) {
//             console.log('Invalid credentials'); // Log invalid credentials
//             return res.status(400).send({
//                 error: true,
//                 msg: 'Invalid credentials'
//             });
//         }

//         jwt.sign({ _id: user?._id, uid: user?.uid, role: user?.role, status: user?.status }, secret, {}, (error, token) => {
//             if (!error) {
//                 return res.cookie('token', token, {
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production',
//                 }).status(200).send({
//                     error: false,
//                     msg: 'Login successful',
//                     data: {
//                         role: user?.role,
//                     }
//                 });
//             } else {
//                 return res.status(500).send({
//                     error: true,
//                     msg: 'Internal server error'
//                 });
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error); // Log error
//         return res.status(500).send({
//             error: true,
//             msg: 'Internal server error'
//         });
//     }
// };