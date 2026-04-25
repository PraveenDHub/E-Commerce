import HandleError from "../helper/handleError.js";
import { sendToken } from "../helper/jwtToken.js";
import { sendMailer } from "../middleware/sendMailer.js";
import User from "../model/userModel.js";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const registerUser = async (req, res, next) => {
  let myCloud;

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new HandleError("Name, Email or Password cannot be Empty", 400));
    }

    // ✅ Dynamic validation (no hardcoding)
    const minPasswordLength = User.schema.path("password").options.minLength;

    if (password.length < minPasswordLength) {
      return next(
        new HandleError(
          `Password must be at least ${minPasswordLength} characters`,
          400
        )
      );
    }

    if (!req.file) {
      return next(new HandleError("Avatar is required", 400));
    }

    // ✅ Upload only after validation
    myCloud = await uploadToCloudinary(req.file.buffer, "avatars");

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

  } catch (error) {

    // 🔥 Cleanup if something fails after upload
    if (myCloud?.public_id) {
      await cloudinary.uploader.destroy(myCloud.public_id);
    }

    return next(new HandleError(error.message, 500));
  }
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
      new HandleError(
        "Couldn't save reset Password or token, Try again Later...",
        500,
      ),
    );
  }

  //  this is for frontend url Need to change later
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

  const message = `Reset your password using this link below:\n\n${resetUrl}\n\n The link expires in 30 minutes. \n\n If this wasn't you, please ignore this mail!`;
  const htmlMessage = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; padding: 40px 20px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
          ShoppingHub Company
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Password Reset</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 40px 35px 30px;">
        
        <h2 style="color: #2c3e50; text-align: center; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">
          Reset Your Password
        </h2>
        
        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello <strong>${user.name}</strong>,
        </p>
        
        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
          We received a request to reset your password. Click the button below to create a new password. 
          This link will expire in 24 hours for security reasons.
        </p>
        
        <!-- Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea, #764ba2);
                    color: #ffffff; 
                    padding: 16px 40px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-size: 17px; 
                    font-weight: 600; 
                    display: inline-block;
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #777777; font-size: 14.5px; line-height: 1.5; margin: 30px 0 0 0;">
          If you didn't request a password reset, you can safely ignore this email. 
          Your account is secure and no changes have been made.
        </p>
        
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 25px 35px; border-top: 1px solid #eeeeee;">
        <p style="color: #999999; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
          © ${new Date().getFullYear()} Your Company. All rights reserved.<br>
          This is an automated email. Please do not reply to this address.
        </p>
        
        <p style="color: #bbbbbb; font-size: 12px; text-align: center; margin: 18px 0 0 0;">
          Coimbatore, Tamil Nadu, India
        </p>
      </div>
      
    </div>
    
    <!-- Subtle security note -->
    <p style="text-align: center; color: #aaaaaa; font-size: 12px; margin: 25px 0 0 0;">
      🔒 Secured by Your Company • Powered by secure email delivery
    </p>
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
    //console.error("Forgot password email error:", error);
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

  sendToken(user, 200, res,"Password reset successfully!");
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
  sendToken(user, 200, res,"Password updated successfully!");
};

export const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new HandleError("Please provide name and email", 400));
  }

  const user = await User.findById(req.user.id);

  const updateDetails = { name, email };

  // 👉 If new image uploaded
  if (req.file) {
    // delete old image
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // upload new image
    const upload = await uploadToCloudinary(req.file.buffer, "avatars");

    updateDetails.avatar = {
      public_id: upload.public_id,
      url: upload.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateDetails,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile Updated successfully!",
    user: updatedUser,
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
      returnDocument: "after", // ✅ replaces new: true
      runValidators: true, // ✅ keep this
    },
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
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return next(new HandleError("User not found!", 404));
    }

    // Try deleting image (but don't break flow)
    try {
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
    } catch (err) {
      console.log("Cloudinary delete failed:", err.message);
    }

    // Always attempt DB delete
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User Deleted successfully!",
    });

  } catch (error) {
    return next(new HandleError(error.message, 500));
  }
};
