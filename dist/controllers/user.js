"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.googleAuthCallback = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        const salt = await bcryptjs_1.default.genSalt(10); // Generate salt
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // console.log(hashedPassword);
        const user = new User_1.default({ email, password: hashedPassword });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.log(error);
    }
};
exports.register = register;
const login = (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });
        res.json({ user, token });
    }
    catch (error) {
        console.log(error);
    }
};
exports.login = login;
const googleAuthCallback = (req, res) => {
    const user = req.user;
    console.log(user);
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
        expiresIn: "1h",
    });
    res.json({ user, token });
};
exports.googleAuthCallback = googleAuthCallback;
const getUser = async (req, res) => {
    // console.log(req.user, req.isAuthenticated);
    if (req.isAuthenticated()) {
        console.log(req.user);
        const user = req.user;
        res.json(user);
    }
    else {
        res.status(401).json({ message: "User not authenticated" });
    }
};
exports.getUser = getUser;
