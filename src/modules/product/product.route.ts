import { FastifyInstance } from 'fastify';
import {
  createProductHandler,
  getProductsHandler,
} from './product.controller';
import { $ref } from './product.schema';

// *** product routes :- create, fetch-all
async function productRoutes(server: FastifyInstance) {
  // *** create product
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createProductInputSchema'),
        response: {
          201: $ref('createProductResponseSchema'),
        },
      },
    },
    createProductHandler
  );
  // *** get all products - authenticated route
  server.get(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: $ref('getProductsResponseSchema'),
        },
      },
    },
    getProductsHandler
  );
}

export default productRoutes;
