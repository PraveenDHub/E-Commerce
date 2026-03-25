import jwt from 'jsonwebtoken';
import HandleError from './handleError.js';
import User from '../model/userModel.js';

export const verifyUser = async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", ""); // 

    if (!token) {
        return next(new HandleError("Unauthorized! Please Log in!.", 403));
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

    if(!decode){
        return next(new HandleError("Unauthorized! Invalid token!.", 403));
    }
    req.user = await User.findById(decode.id);
    // console.log(req.user);
    next();
};

export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new HandleError(`Role: ${req.user.role} is not allowed to access this resource!`,403));
        }
        next();
    };
};