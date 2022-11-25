import { FastifyRequest } from 'fastify';
import { CreateProductInput } from './product.schema';
import { createProduct, fetchAllProducts } from './product.service';

// *** handler to create a new product
export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>
) {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id, // todo
  });
  return product;
}

// *** handler to get all users
export async function getProductsHandler() {
  const products = await fetchAllProducts();
  return products;
}
