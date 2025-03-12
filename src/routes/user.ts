import express from "express";
import passport from "passport";
import {
  register,
  login,
  googleAuthCallback,
  getUser,
} from "../controllers/user";

const router = express.Router();

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000", // توجه المستخدم بعد النجاح
    failureRedirect: "http://localhost:3000/auth",
  }),
  googleAuthCallback
);

router.get("/user", getUser);

export default router;
