import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import UploadRouter from "./routes/uploadRouts.js";
import orderRouter from "./routes/orderRouter.js";

const PORT = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("server Running");
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", UploadRouter);
app.use("/api/orders", orderRouter);

//error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  res.status(500).json({ message: error.message });
});

app.listen(PORT, () => {
  console.log(`surver running on  port ${PORT}`);
});
