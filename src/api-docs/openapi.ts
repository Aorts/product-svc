import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { ApiResponse, CreateProductBody, IdParam, ProductSchema, UpdateProductBody } from "./schemas";
import { z } from "zod";

const registry = new OpenAPIRegistry();

registry.register("product", ProductSchema);

// Paths
registry.registerPath({
  method: "get",
  path: "/api/v1/products",
  summary: "List products",
  request: {},
  responses: {
    200: {
      description: "Products retrieved",
      content: {
        "application/json": {
          schema: ApiResponse(z.array(ProductSchema), "ListProductsResponse"),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/products",
  summary: "Create a product",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateProductBody }
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: ApiResponse(ProductSchema, "CreateProductResponse"),
        },
      },
    },
    400: { description: "Validation failed" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/products/{id}",
  summary: "Get a product",
  request: { params: IdParam },
  responses: {
    200: {
      description: "One product retrieved",
      content: {
        "application/json": {
          schema: ApiResponse(ProductSchema, "GetProductResponse"),
        },
      },
    },
    404: { description: "Not found" },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/products/{id}",
  summary: "Update a product",
  request: {
    params: IdParam,
    body: { content: { "application/json": { schema: UpdateProductBody } } },
  },
  responses: {
    200: {
      description: "Updated",
      content: {
        "application/json": {
          schema: ApiResponse(ProductSchema, "UpdateProductResponse"),
        },
      },
    },
    400: { description: "Validation failed" },
    404: { description: "Not found" },
  },
});

// Generate the OpenAPI v3 document
const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDoc = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Products API",
    version: "1.0.0",
    description: "Hexagonal Express + Zod-generated OpenAPI docs",
  },
  servers: [{ url: "/" }],
});
