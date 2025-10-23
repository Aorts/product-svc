import { ProductRepository } from "../../core/port/repository";
import {ProductService} from "../../core/service/productsvc/service";
import type { NextFunction, Request, Response } from "express";
import { failure, success } from "../../../utility/response";
import { StatusCodes } from "http-status-codes";
import { updateProductFromDTO } from "../../core/domain/product";


export function ProductController(repo: ProductRepository) {
  const productService = new ProductService(repo);

  const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const p = await productService.createProduct(req.body);
      res.status(StatusCodes.CREATED).json(success(p, "success", 0));
    } catch (err) {
        next(err); 
    }
  };

  const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params?.id;
      const p = await productService.getProductById(id);
      if (!p) return res.status(StatusCodes.NOT_FOUND).json(failure("not found", StatusCodes.NOT_FOUND));
      res.status(StatusCodes.OK).json(success(p, "success", 0));
    } catch (err) { next(err); }
  };

  const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sortBy = req.query.sortBy as string;
      const order = req.query.order as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const products = await productService.getProducts({ sortBy, order, page, limit });
      res.status(StatusCodes.OK).json(success(products, "success", 0));
    } catch (err) { next(err); }
  };

  const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body._id = req.params?.id;
      const p = await productService.updateProduct(req.body);
      res.status(StatusCodes.OK).json(success(p, "success", 0));
    } catch (err) { next(err); }
  };

  const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.deleteProduct(req.params?.id);
      res.status(StatusCodes.OK).json(success(null, "Product deleted", 0));
    } catch (err) { next(err); }
  };

  return { createProduct, getProduct, getProducts, updateProduct, deleteProduct };
}
