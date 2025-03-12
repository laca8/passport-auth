"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
}, async (email, password, done) => {
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return done(null, false, { message: "user not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password || "");
        if (!isMatch)
            return done(null, false, { message: "Invalid password" });
        return done(null, user);
    }
    catch (error) {
        console.error(error);
        return done(error);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    var _a;
    try {
        let user = await User_1.default.findOne({ googleId: profile.id });
        if (!user) {
            user = await User_1.default.create({
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                googleId: profile.id,
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.error(error);
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => done(null, user.id));
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        console.error(error);
        return done(error);
    }
});
// ماذا يحدث هنا؟
// عندما يقوم المستخدم بإرسال طلب جديد، يقوم Passport تلقائيًا بتنفيذ deserializeUser لاسترجاع بيانات المستخدم باستخدام id المخزن في الجلسة.
// يتم جلب بيانات المستخدم من قاعدة البيانات وتمريرها إلى req.user حتى يتمكن التطبيق من استخدامها.
