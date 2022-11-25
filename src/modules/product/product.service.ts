import { db } from '../../utils/prisma';
import { CreateProductInput } from './product.schema';

// *** create a new product (owner inferred from logged in user's JWT)
export async function createProduct(
  data: CreateProductInput & { ownerId: number }
) {
  return db.product.create({
    data,
  });
}

// *** get all products
export function fetchAllProducts() {
  return db.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
}
