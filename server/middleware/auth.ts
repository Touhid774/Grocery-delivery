import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(404)
        .json({ message: "No token provided , authorization denid" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Token is not valid" });
  }
};

export default auth;
