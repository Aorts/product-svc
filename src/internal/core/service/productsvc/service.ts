import { AppError } from "../../../../utility/error";
import {
  createProductFromDTO,
  Product,
  ProductPagination,
  updateProductFromDTO,
} from "../../domain/product";
import { ProductRepository } from "../../port/repository";

export class ProductService {
  private readonly productRepository: ProductRepository;

  private validateSortOptions(sortBy: string, order: string) {
    const validSortBy = ["name", "price", "created_at", "updated_at"];
    const validOrder = ["asc", "desc"];

    if (!validSortBy.includes(sortBy)) {
      throw new Error(
        `Invalid sortBy value. Must be one of: ${validSortBy.join(", ")}`,
      );
    }

    if (!validOrder.includes(order)) {
      throw new Error(
        `Invalid order value. Must be one of: ${validOrder.join(", ")}`,
      );
    }
  }
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  public async createProduct(product: any): Promise<Product> {
    const productDTO = createProductFromDTO(product);
    const p = await this.productRepository.create(productDTO);
    return p;
  }

  public async getProductById(id: string): Promise<Product> {
    const p = await this.productRepository.findById(id);
    if (!p) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    return p;
  }

  public async getProducts(options?: {
    sortBy?: string;
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductPagination> {
    const sortBy = options?.sortBy ?? "price";
    const order = options?.order ?? "desc";
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;

    this.validateSortOptions(sortBy, order);
    const Products = await this.productRepository.list(
      sortBy,
      order,
      page,
      limit,
    );
    return Products;
  }

  public async updateProduct(product: any): Promise<void> {
    const existing = await this.productRepository.findById(product._id);
    if (!existing)
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    const p = updateProductFromDTO(existing, product);
    await this.productRepository.update(p);
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
