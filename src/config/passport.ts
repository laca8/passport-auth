import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "user not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return done(null, false, { message: "Invalid password" });
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            email: profile.emails?.[0].value,
            googleId: profile.id,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
});
// ماذا يحدث هنا؟

// عندما يقوم المستخدم بإرسال طلب جديد، يقوم Passport تلقائيًا بتنفيذ deserializeUser لاسترجاع بيانات المستخدم باستخدام id المخزن في الجلسة.
// يتم جلب بيانات المستخدم من قاعدة البيانات وتمريرها إلى req.user حتى يتمكن التطبيق من استخدامها.
