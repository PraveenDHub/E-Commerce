import HandleError from "../helper/handleError.js";
import { sendToken } from "../helper/jwtToken.js";
import { sendMailer } from "../middleware/sendMailer.js";
import User from "../model/userModel.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

export const registerUser = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return next(
      new HandleError("Name, Email or Password cannot be Empty", 400),
    );
  }

  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleError("Email or Password cannot be Empty", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Invalid Email or Password!", 401));
  }

  const isValidPass = await user.verifyPassword(password);
  if (!isValidPass) {
    return next(new HandleError("Invalid Email or Password!", 401));
  }
  user.password = undefined;
  sendToken(user, 200, res);
};

export const logout = (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie("token", null, options);
  res.status(200).json({
    success: true,
    message: "Logout success!",
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User not found with this email!", 400));
  }

  let resetToken;
  try {
    resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Couldn't save reset Token, Try again Later...", 500),
    );
  }

  const resetUrl = `${req.protocol}://${req.host}/reset/${resetToken}`;

  const message = `Reset your password using this link below:\n\n${resetUrl}\n\n The link expires in 30 minutes. \n\n If this wasn't you, please ignore this mail!`;
  const htmlMessage = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
      
      <p style="color: #555555; font-size: 15px;">
        Hello ${user.name},
      </p>
      
      <p style="color: #555555; font-size: 15px;">
        We received a request to reset your password. Click the button below to set a new password.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; 
                  text-decoration: none; border-radius: 5px; font-size: 16px; 
                  display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #777777; font-size: 13px;">
        If you did not request a password reset, please ignore this email.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
      
      <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Your Company. All rights reserved.
      </p>
      
    </div>
  </div>
`;

  try {
    await sendMailer({
      email: user.email,
      subject: "Password Reset Request",
      text: message,
      htmlMessage: htmlMessage,
    });
    res.status(200).json({
      success: true,
      message: `Reset Password link sent to ${user.email}`,
    });
  } catch (error) {
    console.error("Forgot password email error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Failed to send reset email, Try again Later...", 500),
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new HandleError("Invalid Token or Reset code Expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new HandleError("Password and Confirm Password do not match", 400),
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
};

export const profile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new HandleError("User not found!", 404));
  }
  res.status(200).json({
    success: true,
    user,
    message: "Profile loaded successfully!",
  });
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  const isValidPassword = user.verifyPassword(oldPassword);
  if (!isValidPassword) {
    return next(new HandleError("Old Password is incorrect!", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(
      new HandleError("New Password and Confirm Password do not match!", 400),
    );
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
};

export const updateProfile = async (req, res, next) => {
  const {name,email,avatar} = req.body;
  const updateDetails = {name,email};
  if(!name || !email){
    return next(new HandleError("Please provide name and email", 400));
  }
  if(avatar && avatar !== req.user.avatar.url){
    const destroy = await cloudinary.uploader.destroy(req.user.avatar?.public_id);
    if(!destroy){
      return next(new HandleError("Failed to delete old avatar", 500));
    }
    const upload = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    if(!upload){
      return next(new HandleError("Failed to upload new avatar", 500));
    }
    updateDetails.avatar = {
      public_id: upload.public_id,
      url: upload.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, updateDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile Updated sucessfully!",
    user,
  });
};

export const getUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
};

export const getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError("User not found!", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
};

export const updateUserRole = async (req, res, next) => {
  const { role } = req.body;

  // ✅ allow only specific roles
  if (!["user", "admin"].includes(role)) {
    return next(new HandleError("Invalid role!", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new HandleError("User not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "User Role Updated successfully!",
    user,
  });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new HandleError("User not found!", 404));
  }
  res.status(200).json({
    success: true,
    message: "User Deleted sucessfully!",
  });
};
