import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import Pug from 'pug';
import pointOfView from 'point-of-view';
import i18next from 'i18next';
import ru from './locales/ru.js';
import webpackConfig from '../webpack.config.babel.js';

import addRoutes from './routes/routes.js';

dotenv.config();


const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const isDevelopment = mode === 'development';

const setUpViews = (app) => {
  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      assetPath: (filename) => `${domain}/assets/${filename}`,
    },
    templates: path.join(import.meta.url, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = isProduction
    ? path.join(import.meta.url, '..', 'public')
    : path.join(import.meta.url, '..', 'dist', 'public');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = () => {
  i18next
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      resources: {
        ru,
      },
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

  setupLocalization();
  addRoutes(app);
  return app;
};
