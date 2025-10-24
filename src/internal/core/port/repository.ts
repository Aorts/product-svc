import { Product, ProductPagination } from "../domain/product";

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  list(
    sortBy: string,
    order: string,
    page: number,
    limit: number,
  ): Promise<ProductPagination>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}
