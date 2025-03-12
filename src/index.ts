import express from "express";
import passport from "passport";
import cors from "cors";
import session from "express-session";
import connectDB from "./config/db";
import authRoutes from "./routes/user";
import "./config/passport";
import path from "path";
const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS properly
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ 2. إعداد Session (مطلوب لـ Passport.js)
app.use(
  session({
    secret: "mysecretkey", // استبدلها بقيمة آمنة
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // اجعلها true إذا كنت تستخدم HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session()); // مهم جدًا لحفظ الجلسات

app.use("/api/auth", authRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
