import mainPage from './mainPage.js';
import users from './users.js';

const controllers = [mainPage, users];

export default (app) => controllers.forEach((f) => f(app));