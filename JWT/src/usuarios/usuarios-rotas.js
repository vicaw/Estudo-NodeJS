const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require('./middlewares-autenticacao')

module.exports = app => {
  app
    .route('/usuarios/login')
    .post(middlewaresAutenticacao.local, usuariosControlador.login)

  app
    .route('/usuarios/refresh_token')
    .post(middlewaresAutenticacao.refresh, usuariosControlador.login)

  app
    .route('/usuarios/logout')
    .post([middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer], usuariosControlador.logout)
  
  app
    .route('/usuarios')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route('/usuarios/:id')
    .delete(middlewaresAutenticacao.bearer, usuariosControlador.deleta);
};
