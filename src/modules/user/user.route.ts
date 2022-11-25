import { FastifyInstance } from 'fastify';
import { string } from 'zod';
import {
  getUserByIdHandler,
  getUsersHandler,
  loginUserHandler,
  registerUserHandler,
} from './user.controller';
import { $ref } from './user.schema';

// *** user routes: - register, login, fetch-all, fetch-by-id
async function userRoutes(server: FastifyInstance) {
  // server: FastifyInstance & {authenticate} - instead doing global
  // *** register user
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserInputSchema'), // sanitizing input here itself - zod
        response: { 201: $ref('createUserResponseSchema') },
      },
    },
    registerUserHandler
  );
  // *** login user
  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginUserInputSchema'), // sanitizing input here itself - zod
        response: { 200: $ref('loginUserResponseSchema') },
      },
    },
    loginUserHandler
  );
  // *** get all users - authenticated route
  server.get(
    '/',
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler
  );
  // *** get user by id - authenticated route
  server.get(
    '/:id',
    {
      preHandler: [server.authenticate],
    },
    getUserByIdHandler
  );
}

export default userRoutes;
