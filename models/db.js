const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_exemplo', 'root', '', {
  host:'127.0.0.1',
  dialect:'mysql',
  define: {
    charset:'utf8',
    collate:'utf8_general_ci',
    timestamps: true
  },
  logging:false
});

//testando a conexão com o banco
// sequelize.authenticate().then(function(){
//   console.log('Conectado no banco com sucesso!')
// }).catch(function(err){
//   console.log('Falha na conexão: '+ err)
// })
module.exports = {sequelize, Sequelize};