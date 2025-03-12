import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);

    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });

    res.json({ user, token });
  } catch (error) {
    console.log(error);
  }
};

export const googleAuthCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  console.log(user);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
    expiresIn: "1h",
  });

  res.json({ user, token });
};

export const getUser = async (req: Request, res: Response) => {
  // console.log(req.user, req.isAuthenticated);

  if (req.isAuthenticated()) {
    console.log(req.user);

    const user = req.user;
    res.json(user);
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
};
