import { APPLICATION_PORT, APPLICATION_HOST } from './constants';
import buildServer from './server';

async function main() {
  const server = await buildServer();

  // *** start listening on server
  try {
    await server.listen({
      port: APPLICATION_PORT,
      host: APPLICATION_HOST,
    });
    console.log(`server listening at ${APPLICATION_PORT}`);
  } catch (e) {
    console.error(
      `error in starting server at ${APPLICATION_PORT}`,
      e
    );
    process.exit(1);
  }
}

main();
