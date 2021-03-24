export default (app) => {
  app
    .get('/', (req, reply) => reply.send('Hello World'));
};
