yarn init
npm install -g typescript
npx tsc --init

yarn add @prisma/client fastify fastify-zod zod zod-to-json-schema @fastify/jwt @fastify/swagger

yarn add ts-node-dev typescript @types/node  --dev

npx prisma init --datasource-provider postgresql

npx prisma migrate dev --name init

npx prisma studio
