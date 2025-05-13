import { Request, Response, NextFunction } from 'express';
// import User from '../models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken'

const secret = process.env.SECRET





export const decodeToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.cookie?.substring(6) || null;
    if (!!token) {
        if (!secret) {
            return res.status(500).json({
                msg: "Secret is not defined",
                error: true
            });
        }
        const decode = jwt.verify(token, secret) as JwtPayload;
        if (!!decode) {
            res.locals.user = decode;
            return next();
        }
    } 
    return res.status(401).json({
        msg: "Unauthorized!",
        error: true
    });
}


export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.cookie?.substring(6) || null ;
    if (!!token) {
        if (!secret) {
            return res.status(500).json({
                msg: "Secret is not defined",
                error: true
            });
        }
        const decode = jwt.verify(token, secret) as JwtPayload;
        if (!!decode && decode?.role == "admin") {
            res.locals.user = decode;
            return next();
        }
    } 
    return res.status(401).json({
        msg: "Unauthorized ! only admin can access this route",
        error: true
    })
}


export const anyUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.cookie?.substring(6) || null;
    if (!!token) {
        if (!secret) {
            return res.status(500).json({
                msg: "Secret is not defined",
                error: true
            });
        }
        const decode = jwt.verify(token, secret) as JwtPayload;
        if (!!decode && (decode.role === "admin" || decode.role === "user" || decode.role === "trainer")) {
            res.locals.user = decode;
            return next();
        }
    } 
    return res.status(401).json({
        msg: "Unauthorized!",
        error: true
    });
}


export const isUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.cookie?.substring(6) || null;
    if (!!token) {
        if (!secret) {
            return res.status(500).json({
                msg: "Secret is not defined",
                error: true
            });
        }
        const decode = jwt.verify(token, secret) as JwtPayload;
        if (!!decode) {
            res.locals.user = decode;
            return next();
        }
    } 
    return res.status(401).json({
        msg: "Unauthorized!",
        error: true
    });
}



// export const decodeToken = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const token = req.headers?.authorization?.split(" ")[1]
//         if (secret) {
//             if (token) {
//                 res.locals.user = jwt.verify(token, secret)
//             } else {
//                 throw new Error('Token is not defined')
//             }
//         } else {
//             throw new Error('Secret is not defined')
//         }
//         next()
//         return
//     } catch (err) {
//         next()
//     }
// }


// export const isUser = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.cookie?.substring(6) || null ;
//     if (!!token && !!token?.uid && token.role === 'user') {
//         next()
//     } else {
//         res.status(401).send({
//             error: true,
//             msg: 'Unauthorized'
//         })
//     }
// }


// export const isAnyUser = (req: Request, res: Response, next: NextFunction) => {
//     let { user } = res.
//     if (!!user && !!user?.uid && (user.role === 'user' || user.role === 'admin' || user.role === 'seller')) {
//         next()
//     } else {
//         res.status(401).send({
//             error: true,
//             msg: 'Unauthorized'
//         })
//     }
// }


// export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.cookie?.substring(6) || null ;
//     if (!!token) {
//         if (!secret) {
//             return res.status(500).json({
//                 msg: "Secret is not defined",
//                 error: true
//             });
//         }
//         if (!secret) {
//             return res.status(500).json({
//                 msg: "Secret is not defined",
//                 error: true
//             });
//         }
//         const decode = jwt.verify(token, secret) as JwtPayload;
//         if (!!decode && decode?.role == "admin") {
//             res.locals.user = decode;
//             return next();
//         }
//     } 
//     return res.status(401).json({
//         msg: "Unauthorized !",
//         error: true
//     })
// }


