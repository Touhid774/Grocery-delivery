import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//generatetoken

const generatetoken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

//check admin status
const getAdminStatus = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const adminEmails = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase())
    : [];
  return adminEmails.includes(email.toLowerCase());
};
//register
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field are Require" });
  }

  const existignUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existignUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exist with this email" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashedPassword },
  });

  const token = generatetoken(user.id);

  const userData: any = { ...user };
  delete userData.password;
  userData.isAdmin = getAdminStatus(userData.email);

  res.status(201).json({ user: userData, token });
};

//login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field are Require" });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { addresses: true },
  });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credintial" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credintial" });
  }

  const token = generatetoken(user.id);

  const userData: any = { ...user };
  delete userData.password;
  userData.isAdmin = getAdminStatus(userData.email);

  res.status(201).json({ user: userData, token });
};
