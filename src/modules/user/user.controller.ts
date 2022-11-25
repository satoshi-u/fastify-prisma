import { CreateUserInput, LoginUserInput } from './user.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  fetchAllUsers,
  fetchUserById,
  findUserByEmail,
} from './user.service';
import { verifyPassword } from '../../utils/hash';

// *** handler to register new user
export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body);
    return reply.code(201).send(user); // sending user as per response-schema as mentioned in schema/app/route
  } catch (e) {
    console.error(`error in registerUserHandler`, e);
    return reply.code(500).send({
      message: e,
    });
  }
}

// *** handler to login an existing user
export async function loginUserHandler(
  request: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    // *** find a user by email
    const user = await findUserByEmail(body.email);
    if (!user) {
      return reply.code(401).send({
        message: 'Invalid email or password',
      });
    }
    // *** verify password
    const isCorrectPassword = verifyPassword({
      candidatePassword: body.password,
      salt: user.salt,
      hash: user.password, // todo: change password field to passwordHash
    });
    if (!isCorrectPassword) {
      return reply.code(401).send({
        message: 'Invalid email or password',
      });
    }
    // *** generate access token
    const { password, salt, ...toSignJWT } = user;
    // *** respond
    return reply.code(200).send({
      accessToken: request.jwt.sign(toSignJWT),
    }); // sending accessToken as per response-schema as mentioned in schema/app/route
  } catch (e) {
    console.error(`error in registerUserHandler`, e);
    return reply.code(500).send({
      message: e,
    });
  }
}

// *** handler to get all users
export async function getUsersHandler() {
  try {
    const users = await fetchAllUsers();
    return users; // sending users fields as per query method in service
  } catch (e) {
    console.error(`error in getUsersHandler`, e);
  }
}

// *** handler to get user by id
export async function getUserByIdHandler(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const user = await fetchUserById(Number(id));
    if (!user) {
      return reply.code(404).send({
        message: `user with id ${id} not found`,
      });
    }
    return user; // sending user fields as per query method in service
  } catch (e) {
    console.error(`error in getUserByIdHandler`, e);
    return reply.code(500).send({
      message: e,
    });
  }
}
