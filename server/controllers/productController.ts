import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getFlashDeal = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { originalPrice: "desc" },
  });

  const productWithDiscount = products.map((p: any) => {
    const discount =
      p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return { ...p, discount };
  });
  res.json({ products: productWithDiscount.slice(0, 8) });
};

//get all products

export const getProducts = async (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;

  const where: any = {};

  if (category && category !== "all") where.category = category as string;
  if (search) where.name = { contaon: search as string, mode: "insencitive" };

  if (maxPrice || minPrice) {
    where.price = {};

    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  const orderBy: any = {};
  if (sort === "price-low") {
    orderBy.price = "asc";
  } else if (sort === "price-high") {
    orderBy.price = "desc";
  } else {
    orderBy.createdAt = "desc";
  }

  const products = await prisma.product.findMany({ where, orderBy });

  const productWithDiscount = products.map((p: any) => {
    const discount =
      p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return { ...p, discount };
  });

  res.json({ products: productWithDiscount });
};

//get product

export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id as string },
  });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const discount =
    product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  res.json({ product: { ...product, discount } });
};

//create Product
export const createProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.create({ data: req.body });

  res.status(201).json({ product });
};

//update Product
export const updateProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    where: { id: req.params.id as string },
    data: req.body,
  });
  if (!product) {
    res.status(400).json({ message: "Product not found" });
  }

  res.status(200).json({ product });
};

//delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.delete({
    where: { id: req.params.id as string },
  });

  if (!product) {
    res.status(400).json("Product not found");
  }

  res.status(200).json({ message: "Product deleted" });
};
