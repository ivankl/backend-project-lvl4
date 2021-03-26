import dotenv from 'dotenv';
import fastify from 'fastify';
import path from 'path';
import Pug from 'pug';
import pointOfView from 'point-of-view';

import addRoutes from './routes/routes.js';

dotenv.config();

const setUpViewEngine = (app) => {
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    templates: path.join(import.meta.url, '..', 'server', 'views'),
  });
};

export default () => {
  const app = fastify(
    {
      logger: {
        prettyPrint: true,
      },
    },
  );
  addRoutes(app);
  setUpViewEngine(app);
  return app;
};
