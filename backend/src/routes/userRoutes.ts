import express from "express";
import {
  login,
  signup,
  googleOAuthCallback,
  googleOAuth,
  userLogout,
  fetchUsers
} from "../controllers/userController";
import { verifyJWT } from "../middleware/auth.middleware";
const userRoutes = express.Router();

userRoutes.post("/login", login as any);
userRoutes.post("/signup", signup);
userRoutes.get("/auth/google", googleOAuth);
userRoutes.get("/google-oauth-callback", googleOAuthCallback);
userRoutes.get('/logout', verifyJWT, userLogout);
userRoutes.get('/connections/get', verifyJWT, fetchUsers as any);

export default userRoutes;
