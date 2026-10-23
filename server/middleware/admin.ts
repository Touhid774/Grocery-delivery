import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(404).json({ message: "Un-authorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: " user not found" });
    }
    const adminsEmail = process.env.ADMIN_EMAIL
      ? process.env.ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase())
      : [];

    if (adminsEmail.includes(user.email.toLowerCase())) {
      if (req.user) req.user.isAdmin = true;
      next();
    } else {
      return res.status(403).json({ message: "Admin access required" });
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(501)
      .json({ message: "Admin verification filed", error: error.message });
  }
};

export default adminAuth;
