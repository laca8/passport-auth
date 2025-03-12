"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.post("/register", user_1.register);
router.post("/login", passport_1.default.authenticate("local", { session: false }), user_1.login);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:3000", // توجه المستخدم بعد النجاح
    failureRedirect: "http://localhost:3000/auth",
}), user_1.googleAuthCallback);
router.get("/user", user_1.getUser);
exports.default = router;
