import { z } from "zod";

/*
 * createProductSchema is a Zod validation schema for product creation
 *
 * Purpose:
 * - Validates user input data types and constraints
 * - Filters out invalid data before API submission
 * - Provides TypeScript type safety
 * - Generates user-friendly error messages
 *
 * Used with react-hook-form for real-time form validation
 */

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  price: z
    .number({ error: "Price is required" })
    .min(100, "Price must be at least $1.00"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  quantityInStock: z
    .number({ error: "Quantity is required" })
    .min(1, "Quantity must be at least 1"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
