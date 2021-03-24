import dotenv from 'dotenv';
import fastify from 'fastify';
import addRoutes from './routes/routes.js';

dotenv.config();

const port = process.env.PORT;

export default () => {
  const app = fastify(
    {
      logger: {
        prettyPrint: true,
      },
    },
  );
  console.log(port);
  addRoutes(app);
  return app;
};
