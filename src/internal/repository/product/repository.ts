import mongoose, { Types } from "mongoose";
import { Product } from "../../core/domain/product";
import { ProductRepository } from "../../core/port/repository";
import { ProductSchema } from "./schema";


const ProductModel = mongoose.model("Product", ProductSchema);

export class MongooseProductRepository implements ProductRepository {
  async create(product: Product) { 
    const doc = await new ProductModel({ ...product }).save();
    return new Product(doc._id.toString(), doc.name, doc.price || 0, doc.description || "", doc.stock_quantity || 0, doc.reserved_quantity || 0, doc.sold_quantity || 0, doc.is_published || false, doc.created_at, doc.updated_at);
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await ProductModel.findById(id).lean();
    return doc ? new Product(doc._id.toString(), doc.name, doc.price || 0, doc.description || "", doc.stock_quantity || 0, doc.reserved_quantity || 0, doc.sold_quantity || 0, doc.is_published || false, doc.created_at, doc.updated_at) : null;
  }

  async list(sortBy: string, order: string, page: number, limit: number) {
    const sortOrder = order === "asc" ? 1 : -1;
    const docs = await ProductModel.find().sort({ [sortBy]: sortOrder }).skip((page - 1) * limit).limit(limit+1).lean();
    return {
      Products: docs.slice(0, limit).map(doc => new Product(doc._id.toString(), doc.name, doc.price || 0, doc.description || "", doc.stock_quantity || 0, doc.reserved_quantity || 0, doc.sold_quantity || 0, doc.is_published || false, doc.created_at, doc.updated_at)),
      page,
      limit,
      hasNextPage: docs.length > limit
    };
  }
  
  async update(product: Product) {
    if (!Types.ObjectId.isValid(product._id)) throw new Error("Invalid id");
    await ProductModel.updateOne({ _id: product._id }, { $set: { name: product.name, price: product.price, description: product.description, stock_quantity: product.stock_quantity, reserved_quantity: product.reserved_quantity, sold_quantity: product.sold_quantity, is_published: product.is_published, created_at: product.created_at, updated_at: product.updated_at } });
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid id");
    await ProductModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}