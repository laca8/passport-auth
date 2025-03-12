"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const db_1 = __importDefault(require("./config/db"));
const user_1 = __importDefault(require("./routes/user"));
require("./config/passport");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Enable CORS properly
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ✅ 2. إعداد Session (مطلوب لـ Passport.js)
app.use((0, express_session_1.default)({
    secret: "mysecretkey", // استبدلها بقيمة آمنة
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // اجعلها true إذا كنت تستخدم HTTPS
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session()); // مهم جدًا لحفظ الجلسات
app.use("/api/auth", user_1.default);
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../client", "dist", "index.html"));
    });
}
else {
    app.get("/", (req, res) => {
        res.send("Api is running...");
    });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
