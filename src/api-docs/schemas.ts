import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const ProductSchema = z
  .object({
    _id: z.string().openapi({ example: "671b3f1e0eec3d1fda4b0022" }),
    name: z.string().openapi({ example: "Sample Product" }),
    price: z.number().openapi({ example: 19.99 }),
    description: z.string().openapi({ example: "This is a sample product." }),
    stock_quantity: z.number().openapi({ example: 100 }),
    reserved_quantity: z.number().openapi({ example: 10 }),
    sold_quantity: z.number().openapi({ example: 50 }),
    is_published: z.boolean().openapi({ example: true }),
    created_at: z.date().openapi({ example: "2024-01-01T12:00:00Z" }),
    updated_at: z.date().openapi({ example: "2024-01-02T12:00:00Z" }),
  })
  .openapi("Product");

export const CreateProductBody = z
  .object({
    name: z.string().min(1).openapi({ example: "Sample Product" }),
    price: z.number().min(0).openapi({ example: 19.99 }),
    description: z
      .string()
      .min(1)
      .openapi({ example: "This is a sample product." }),
    stock_quantity: z.number().min(0).openapi({ example: 100 }),
    reserved_quantity: z.number().min(0).openapi({ example: 10 }),
    sold_quantity: z.number().min(0).openapi({ example: 50 }),
    is_published: z.boolean().openapi({ example: true }),
  })
  .openapi("CreateProductBody");

export const UpdateProductBody = z
  .object({
    name: z.string().min(1).optional().openapi({ example: "New name" }),
    price: z.number().min(0).optional().openapi({ example: 29.99 }),
    description: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: "This is an updated product description." }),
    stock_quantity: z.number().min(0).optional().openapi({ example: 150 }),
    reserved_quantity: z.number().min(0).optional().openapi({ example: 20 }),
    sold_quantity: z.number().min(0).optional().openapi({ example: 75 }),
    is_published: z.boolean().optional().openapi({ example: false }),
  })
  .openapi("UpdateProductBody");

export const IdParam = z
  .object({
    id: z.string().openapi({ example: "671b3f1e0eec3d1fda4b0022" }),
  })
  .openapi("IdParam");

export const StatusSchema = z
  .object({
    code: z.number().openapi({ example: 200 }),
    message: z.string().openapi({ example: "Request succeeded" }),
    data: z.any().openapi({
      example: {
        /* example data */
      },
    }),
  })
  .openapi("Status");

export const ApiResponse = <T extends z.ZodTypeAny>(data: T, name: string) =>
  z
    .object({
      status: StatusSchema,
      data,
    })
    .openapi(name);
