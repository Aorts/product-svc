import { Schema, Types } from "mongoose";

export const ProductSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
  name: { type: String, required: true },
  price: Number,
  description: String,
  stock_quantity: { type: Number, default: 0 },
  reserved_quantity: { type: Number, default: 0 },
  sold_quantity: { type: Number, default: 0 },
  is_published: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
