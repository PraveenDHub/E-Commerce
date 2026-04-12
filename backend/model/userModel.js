import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
      maxLength: [30, "Name cannot exceed 30 characters!"],
      minLength: [4, "Name should have more than 4 characters!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
      minLength: [8, "Password should be greater than 8 characters!"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    // ✅ Improved Cart Items
    cartItems: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: String,
          price: Number,
          image: String,
          quantity: {
            type: Number,
            default: 1,
            min: 1,
          },
        },
      ],
      default: [],   // ← Explicitly set default
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// userSchema.pre("insertMany", async function (next, docs) {

//     for (let doc of docs) {
//         if (doc.password) {
//             doc.password = await bcrypt.hash(doc.password, 10);
//         }
//     }
//     next();
// });

userSchema.methods.verifyPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
