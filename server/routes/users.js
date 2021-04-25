import i18next from 'i18next';

export default (app) => 
    app.get('/users/new', { name: 'newUser' }, async (req, reply) => {
    const user = new app.objection.models.user();
    reply.render('users/new', { user });
})