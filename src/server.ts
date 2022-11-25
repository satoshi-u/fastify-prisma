import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import userRoutes from './modules/user/user.route';
import { userModels, userSchemas } from './modules/user/user.schema';
import {
  productModels,
  productSchemas,
} from './modules/product/product.schema';
import fjwt from '@fastify/jwt';
import productRoutes from './modules/product/product.route';
import { buildJsonSchemas, register } from 'fastify-zod';
import { version } from '../package.json';
// import colors from 'colors';

// todo: learn more and move this code to a different file
// adding authenticate prop in FastifyInstance type globally
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
  export interface FastifyRequest {
    jwt: any;
  }
}
// adding authenticate prop in FastifyInstance type globally
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
}

async function buildServer() {
  const server = Fastify();

  // *** add jwt decorator
  server.register(fjwt, { secret: 'asdlkfjnadslkvjnasdlkjfcnas' });
  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        console.error(`error in decorator @authenticate`, e);
        return reply.send(e);
      }
    }
  );

  // *** health-check route
  server.get('/healthcheck', async () => {
    return { status: 'OK' };
  });

  // *** adds server's jwt instance to each incoming request
  server.addHook('preHandler', (req, res, next) => {
    req.jwt = server.jwt;
    return next();
  });

  // *** add schemas
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  // *** register swagger for documentation
  await register(server, {
    jsonSchemas: buildJsonSchemas(
      { ...userModels, ...productModels },
      { $id: 'swagger' }
    ),
    swaggerOptions: {
      routePrefix: '/docs',
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: 'Fastify API',
          description: 'API for user & products',
          version,
        },
      },
    },
  });

  // *** register user & product Routes
  server.register(userRoutes, { prefix: 'api/users' });
  server.register(productRoutes, { prefix: 'api/products' });

  return server;
}

export default buildServer;
