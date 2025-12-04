import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../definitions/IUser";
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
  },
  authProvider: {
    type: String,
  },
  avatar: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  id_token: {
    type: String,
  },
  connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.CLIENT_SECRET as string,
    {
      expiresIn: 3599 * 1000,
    },
  );
};

UserSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.CLIENT_SECRET as string,
  );
};

UserSchema.methods.generateIdToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      avatar: this?.avatar,
    },
    process.env.CLIENT_SECRET as string,
    {
      expiresIn: 3599,
    },
  );
};

export const User = model<IUser>("User", UserSchema);
