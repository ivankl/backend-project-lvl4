import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import Pug from 'pug';
import pointOfView from 'point-of-view';
import i18next from 'i18next';
// import i18nextmiddleware from 'i18next-http-middleware';
import ru from './locales/ru.js';
import webpackConfig from '../webpack.config.babel.js';
import getHelpers from './helpers/index.js';

import addRoutes from './routes/routes.js';

dotenv.config();

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const isDevelopment = mode === 'development';

const setUpViews = (app) => {
  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';
  const { pathname } = new URL(import.meta.url);
  const helpers = getHelpers();
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: { ...helpers },
    templates: path.resolve(pathname, '..', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {

  const { pathname } = new URL(import.meta.url);
  const pathPublic = isProduction
    ? path.join(pathname, '../..', 'public')
    : path.join(pathname, '../..', 'public');
  console.log(pathPublic);
  app.register(fastifyStatic, {
    root: pathPublic,
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

export default () => {
  const app = fastify(
    {
      logger: {
        prettyPrint: true,
      },
    },
  );

  setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  return app;
};
