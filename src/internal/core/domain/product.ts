import { AppError } from "../../../utility/error";

export class Product {
  constructor(
    public readonly _id: string,
    public name: string,
    public price: number,
    public description: string,
    public stock_quantity: number,
    public reserved_quantity: number,
    public sold_quantity: number,
    public is_published: boolean,
    public created_at: Date,
    public updated_at: Date
  ) {
    if (!name?.trim()) throw new Error("name is required");
    if (price < 0) throw new Error("price must be non-negative");
    if (stock_quantity < 0) throw new Error("stock_quantity must be non-negative");
    if (reserved_quantity < 0) throw new Error("reserved_quantity must be non-negative");
    if (sold_quantity < 0) throw new Error("sold_quantity must be non-negative");
  }
}

export function createProductFromDTO(dto: any): Product {
  validateRequestBody(dto);
  return new Product(
    dto._id,
    dto.name,
    dto.price || 0,
    dto.description || "",
    dto.stock_quantity || 0,
    dto.reserved_quantity || 0,
    dto.sold_quantity || 0,
    dto.is_published || false,
    dto.created_at ? new Date(dto.created_at) : new Date(),
    dto.updated_at ? new Date(dto.updated_at) : new Date()
  );
}

export function updateProductFromDTO(product: Product, dto: any): Product {
  validateRequestBody(dto);
  product.name = dto.name ?? product.name;
  product.price = dto.price ?? product.price;
  product.description = dto.description ?? product.description;
  product.stock_quantity = dto.stock_quantity ?? product.stock_quantity;
  product.reserved_quantity = dto.reserved_quantity ?? product.reserved_quantity;
  product.sold_quantity = dto.sold_quantity ?? product.sold_quantity;
  product.is_published = dto.is_published ?? product.is_published;
  product.updated_at = new Date();
  return product;
}

function validateRequestBody(dto: any)  {
  if (!dto.name || typeof dto.name !== "string" || !dto.name.trim()) {
    throw new AppError("Invalid or missing 'name'", 400, "INVALID_NAME");
  }

  if (dto.price == null || typeof dto.price !== "number" || dto.price < 0) {
    throw new AppError("Invalid or missing 'price'", 400, "INVALID_PRICE");
  }

  if (dto.stock_quantity != null && (typeof dto.stock_quantity !== "number" || dto.stock_quantity < 0)) {
    throw new AppError("Invalid 'stock_quantity'", 400, "INVALID_STOCK_QUANTITY");
  }

  if (dto.reserved_quantity != null && (typeof dto.reserved_quantity !== "number" || dto.reserved_quantity < 0)) {
    throw new AppError("Invalid 'reserved_quantity'", 400, "INVALID_RESERVED_QUANTITY");
  }

  if (dto.sold_quantity != null && (typeof dto.sold_quantity !== "number" || dto.sold_quantity < 0)) {
    throw new AppError("Invalid 'sold_quantity'", 400, "INVALID_SOLD_QUANTITY");
  }

  if (dto.is_published != null && typeof dto.is_published !== "boolean") {
    throw new AppError("Invalid 'is_published'", 400, "INVALID_IS_PUBLISHED");
  }
}

export interface ProductPagination {
  Products: Product[];
  page: number;
  limit: number;
  hasNextPage?: boolean;
}