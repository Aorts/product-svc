import { Product, ProductPagination } from "../../internal/core/domain/product";
import { ProductRepository } from "../../internal/core/port/repository";

export class InMemoryProductRepository implements ProductRepository {
  private store = new Map<string, Product>();


  async create(product: Product): Promise<Product> {
    if (this.store.has(product._id)) {
      throw new Error("Product with this ID already exists");
    }
    this.store.set(product._id, new Product(product._id, product.name, product.price, product.description, product.stock_quantity, product.reserved_quantity, product.sold_quantity, product.is_published, product.created_at, product.updated_at));
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const t = this.store.get(id);
    return t ? new Product(t._id, t.name, t.price, t.description, t.stock_quantity, t.reserved_quantity, t.sold_quantity, t.is_published, t.created_at, t.updated_at) : null;
  }

    // Paginate products
  async list(sortBy: string, order: string, page: number, limit: number): Promise<ProductPagination> {
    const products = [...this.store.values()].map(t => new Product(t._id, t.name, t.price, t.description, t.stock_quantity, t.reserved_quantity, t.sold_quantity, t.is_published, t.created_at, t.updated_at));
    products.sort((a, b) => {
      if (sortBy === "name") {
        return order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return 0;
    });
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      Products: products.slice(start, end),
      page: page,
      limit: limit,
      hasNextPage: end < products.length,
    };
  }

  async update(product: Product): Promise<void> {
    if (!this.store.has(product._id)) return;
    this.store.set(product._id, new Product(product._id, product.name, product.price, product.description, product.stock_quantity, product.reserved_quantity, product.sold_quantity, product.is_published, product.created_at, product.updated_at));
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
