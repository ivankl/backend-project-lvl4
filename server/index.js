import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyObjectionjs from 'fastify-objectionjs';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import path from 'path';
import Pug from 'pug';
import pointOfView from 'point-of-view';
import i18next from 'i18next';
import ru from './locales/ru.js';
import webpackConfig from '../webpack.config.babel.js';
import getHelpers from './helpers/index.js';
import knexConfig from '../knexfile.js';
import models from './models/index.js';

import addRoutes from './routes/index.js';

dotenv.config();

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const isDevelopment = mode === 'development';

const setUpViews = (app) => {
  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';
  const helpers = getHelpers(app);
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `${domain}/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = isProduction
    ? path.join(__dirname, '..', 'public')
    : path.join(__dirname, '..', 'dist', 'public');
  console.log(pathPublic);
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = (app) => {
  i18next
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      debug: isDevelopment,
      resources: {
        ru,
      },
    });
};

const registerPlugins = (app) => {
  app.register(fastifyReverseRoutes.plugin);
  app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
  app.register(fastifyMethodOverride);
};

export default () => {
  const app = fastify(
    {
      logger: {
        prettyPrint: true,
      },
    },
  );
  registerPlugins(app);

  setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  return app;
};
