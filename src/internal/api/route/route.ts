import { Router } from "express";
import { ProductRepository } from "../../core/port/repository";
import { ProductController } from "../../application/controller/ProductController";

export function buildRouter(repo: ProductRepository) {
  const r = Router();
  const c = ProductController(repo);

  r.get("/healthz", (_, res) => {
    res.status(200).send("OK");
  });

  r.post("/api/v1/products", c.createProduct);
  r.get("/api/v1/products", c.getProducts);
  r.get("/api/v1/products/:id", c.getProduct);
  r.put("/api/v1/products/:id", c.updateProduct);
  r.delete("/api/v1/products/:id", c.deleteProduct);

  return r;
}
