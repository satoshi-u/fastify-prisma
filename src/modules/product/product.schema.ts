import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

// *** product input
const productInput = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};
// *** product generated
const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

// *** create product schemas
const createProductInputSchema = z.object({
  ...productInput,
});
const createProductResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
});

// *** get products schemas
const getProductsResponseSchema = z.array(
  z.object({
    ...productInput,
    ...productGenerated,
  })
);

export type CreateProductInput = z.infer<
  typeof createProductInputSchema
>;
export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductInputSchema,
    createProductResponseSchema,
    getProductsResponseSchema,
  },
  { $id: 'products' }
);
export const productModels = {
  createProductInputSchema,
  createProductResponseSchema,
  getProductsResponseSchema,
};
