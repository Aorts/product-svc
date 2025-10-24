import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProductRepository } from "../../../../../tests/doubles/InMemoryProductRepository";
import { ProductService } from "../service";
import { mongo } from "mongoose";
import { AppError } from "../../../../../utility/error";

describe("ProductService", () => {
  let repo: InMemoryProductRepository;
  let svc: ProductService;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    svc = new ProductService(repo);
  });

  it("creates a product", async () => {
    const product = await svc.createProduct({
      _id: new mongo.ObjectId().toString(),
      name: "Test Product",
      price: 100,
      description: "A product for testing",
      stock_quantity: 50,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    expect(product._id).toBeTruthy();
    expect(product.name).toBe("Test Product");
    expect(product.price).toBe(100);
    expect(product.description).toBe("A product for testing");
    expect(product.stock_quantity).toBe(50);
    expect(product.reserved_quantity).toBe(0);
    expect(product.sold_quantity).toBe(0);
    expect(product.is_published).toBe(true);
  });

  it("rejects empty name", async () => {
    await expect(
      svc.createProduct({
        name: "",
        price: 100,
        description: "A product for testing",
        stock_quantity: 50,
        reserved_quantity: 0,
        sold_quantity: 0,
        is_published: true,
      }),
    ).rejects.toThrowError(/Invalid or missing 'name'/i);
  });

  it("rejects negative price", async () => {
    await expect(
      svc.createProduct({
        name: "test123",
        price: -1,
        description: "A product for testing",
        stock_quantity: 50,
        reserved_quantity: 0,
        sold_quantity: 0,
        is_published: true,
      }),
    ).rejects.toThrowError(/Invalid or missing 'price'/i);
  });

  it("rejects negative stock quantity", async () => {
    await expect(
      svc.createProduct({
        name: "test123",
        price: 100,
        description: "A product for testing",
        stock_quantity: -50,
        reserved_quantity: 0,
        sold_quantity: 0,
        is_published: true,
      }),
    ).rejects.toThrowError(/Invalid 'stock_quantity'/i);
  });

  it("rejects negative reserved quantity", async () => {
    await expect(
      svc.createProduct({
        name: "test123",
        price: 100,
        description: "A product for testing",
        stock_quantity: 50,
        reserved_quantity: -1,
        sold_quantity: 0,
        is_published: true,
      }),
    ).rejects.toThrowError(/Invalid 'reserved_quantity'/i);
  });

  it("rejects negative sold quantity", async () => {
    await expect(
      svc.createProduct({
        name: "test123",
        price: 100,
        description: "A product for testing",
        stock_quantity: 50,
        reserved_quantity: 0,
        sold_quantity: -1,
        is_published: true,
      }),
    ).rejects.toThrowError(/Invalid 'sold_quantity'/i);
  });

  it("rejects invalid is_published value", async () => {
    await expect(
      svc.createProduct({
        name: "test123",
        price: 1,
        description: "A product for testing",
        stock_quantity: 50,
        reserved_quantity: 0,
        sold_quantity: 0,
        is_published: "draft",
      }),
    ).rejects.toThrowError(/Invalid 'is_published'/i);
  });

  it("updates an existing product", async () => {
    const a = await svc.createProduct({
      name: "initial",
      price: 100,
      description: "A product for testing",
      stock_quantity: 50,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    await svc.updateProduct({
      id: a._id,
      name: "renamed",
      price: 150,
      description: "Updated product",
      stock_quantity: 60,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    const updated = await svc.getProductById(a._id);
    expect(updated.name).toBe("renamed");
    expect(updated.price).toBe(150);
    expect(updated.description).toBe("Updated product");
    expect(updated.stock_quantity).toBe(60);
  });

  it("throws 404 when updating non-existent todo", async () => {
    await expect(
      svc.updateProduct({
        _id: new mongo.ObjectId().toString(),
        name: "nonexistent",
        price: 100,
        description: "A product for testing",
        stock_quantity: 50,
        reserved_quantity: 0,
        sold_quantity: 0,
        is_published: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("gets by id or throws 404", async () => {
    const a = await svc.createProduct({
      name: "keep me",
      price: 100,
      description: "A product for testing",
      stock_quantity: 50,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    const got = await svc.getProductById(a._id);
    expect(got.name).toBe("keep me");
    await expect(svc.getProductById("404")).rejects.toBeInstanceOf(AppError);
  });

  it("lists all products", async () => {
    await svc.createProduct({
      _id: new mongo.ObjectId().toString(),
      name: "a",
      price: 100,
      description: "A product for testing",
      stock_quantity: 50,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    await svc.createProduct({
      _id: new mongo.ObjectId().toString(),
      name: "b",
      price: 100,
      description: "A product for testing",
      stock_quantity: 50,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    const all = await svc.getProducts();
    expect(all.Products.length).toBe(2);
    expect(all.Products[0].name).toBe("a");
    expect(all.Products[1].name).toBe("b");
  });

  it("deletes a product", async () => {
    const a = await svc.createProduct({
      name: "to be deleted",
      price: 100,
      description: "A product for testing",
      stock_quantity: 50,
      reserved_quantity: 0,
      sold_quantity: 0,
      is_published: true,
    });
    await svc.deleteProduct(a._id);
    await expect(svc.getProductById(a._id)).rejects.toBeInstanceOf(AppError);
  });
});
