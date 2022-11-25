import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

// *** every field required by default in all zod schemas
const userCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  name: z.string(),
};

// *** create user schemas
const createUserInputSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});
const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

// *** login user schemas
const loginUserInputSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});
const loginUserResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type LoginUserInput = z.infer<typeof loginUserInputSchema>;
export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserInputSchema,
    createUserResponseSchema,
    loginUserInputSchema,
    loginUserResponseSchema,
  },
  { $id: 'users' }
);
export const userModels = {
  createUserInputSchema,
  createUserResponseSchema,
  loginUserInputSchema,
  loginUserResponseSchema,
};
