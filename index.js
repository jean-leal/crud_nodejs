const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

//configuração do handlebars
app.engine('hbs', hbs.engine({
  extname: 'hbs', 
  defaultLayout: 'main'
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended:false}));

//importar model usuarios
const Usuario = require('./models/Usuario')

//configuração das sessions
app.use(session({
  secret:'CriarUmaChaveQualquer2133',
  resave:false,
  saveUninitialized:true
}));

app.get('/',(req,res)=>{
  if(req.session.errors){
    var arrayErros = req.session.errors;
    req.session.errors = '';
    return res.render('index', {NavActiveCad:true, error:arrayErros});
  }
  if(req.session.success){
    req.session.success =false;
    return res.render('index', {NavActiveCad:true, MsgSuccess:true});
  }
  res.render('index', {NavActiveCad:true});

})
app.get('/users',(req,res)=>{
  Usuario.findAll()
  .then((valores)=>{
    //console.log(valores.map(valores=>valores.toJSON()));
    if(valores.length > 0 ){
      return res.render('users', {NavActiveUsers:true, table:true, usuarios:valores.map(valores=>valores.toJSON())})
    }else{
      res.render('users', {NavActiveUsers:true, table: false});
    }
  }).catch((err)=>{
    console.log(`Houve um problema: ${err}`);
  })
  // res.render('users', {NavActiveUsers:true});
})
app.post('/editar',(req,res)=>{
  var id = req.body.id;
  Usuario.findByPk(id)
    .then((dados)=>{
      return res.render('editar', {error:false, id : dados.id, email : dados.email, nome : dados.nome})
    })
    .catch((err)=>{
      console.log(err);
      return res.render('editar', {error:true, problema:'Não é possível editar este registro'});
    })
  //res.render('editar');
})
app.post('/cad',(req,res)=>{
  //valores vindos do formulario
  var nome = req.body.nome;
  var email = req.body.email;
  //array que vai conferir os erros 
  const erros = [];

  // remover os espaços em branco
  nome = nome.trim();
  email = email.trim();
  

  //limpar o nome de caracteres especiais(apenas letras)
  nome = nome.replace(/[^A-zÀ-ú\s]/gi, '');
  nome = nome.trim();
  //verificar se esta vazio ou não definido o campo
  if (nome == '' || typeof nome == undefined || nome == null){
    erros.push({mensagem: 'Campo nome não pode ser vazio!'})
  }
  
  
  //verificar se o campo nome é válido(apenas letras)
  if(!/^[A-Za-záàâãéèêíïóõôöúçñÁÀÂÃÉÈÍÏÓÕÖÚCÑ\s]+$/.test(nome)){
    erros.push({mensagem:'Nome inválido!'});
  }

  //verificar se esta vazio ou não definido o campo
  if (email == '' || typeof email == undefined || email == null){
    erros.push({mensagem: 'Campo email não pode ser vazio!'})
  }

  //verificar se o email é válido
  
  if(!/^(\w+)@[a-z]+(\.[a-z]+){1,2}$/.test(email)){
    erros.push({mensagem:'Campo email inválido!'});
  }
  if(erros.length > 0){
    console.log(erros);
    req.session.errors = erros;
    req.session.success = false;
    return res.redirect('/');
  }

  //sucesso nenhum erro 
  //salvar no banco de dados 
  Usuario.create({
    nome : nome,
    email : email.toLowerCase(),
  }).then(function(){
    console.log('Cadastrado com sucesso!');
    req.session.success = true;
    return res.redirect('/');
  }).catch(function(err){
    console.lof(`Ops, houve um erro: ${err}`);
  })

  

})

app.post('/update', (req, res)=>{
  
  //valores vindos do formulario
  var nome = req.body.nome;
  var email = req.body.email;
  //array que vai conferir os erros 
  const erros = [];

  // remover os espaços em branco
  nome = nome.trim();
  email = email.trim();
  

  //limpar o nome de caracteres especiais(apenas letras)
  nome = nome.replace(/[^A-zÀ-ú\s]/gi, '');
  nome = nome.trim();
  //verificar se esta vazio ou não definido o campo
  if (nome == '' || typeof nome == undefined || nome == null){
    erros.push({mensagem: 'Campo nome não pode ser vazio!'})
  }
  
  
  //verificar se o campo nome é válido(apenas letras)
  if(!/^[A-Za-záàâãéèêíïóõôöúçñÁÀÂÃÉÈÍÏÓÕÖÚCÑ\s]+$/.test(nome)){
    erros.push({mensagem:'Nome inválido!'});
  }

  //verificar se esta vazio ou não definido o campo
  if (email == '' || typeof email == undefined || email == null){
    erros.push({mensagem: 'Campo email não pode ser vazio!'})
  }

  //verificar se o email é válido
  
  if(!/^(\w+)@[a-z]+(\.[a-z]+){1,2}$/.test(email)){
    erros.push({mensagem:'Campo email inválido!'});
  }
  if(erros.length > 0){
    console.log(erros);
    return res.status(400).send({status : 400, erro : erros})
  }
  //sucesso nenhum erro 
  // atualizar registro no banco de dados
  Usuario.update({
    nome : nome,
    email : email.toLowerCase()
  },{
    where : {
      id : req.body.id
    }
  }).then((resultado)=>{
    console.log(resultado);
    return res.redirect('/users');
  }).catch((err)=>{
    console.log(err);
  })
})

app.post('/del', (req, res)=>{
  Usuario.destroy({
    where: {
      id: req.body.id
    }
  }).then((retorno)=>{
    return res.redirect('/users');
  })
  .catch((err)=>{
    console.log(err);
  })
})

app.listen(PORT, ()=>{
  console.log(`Servidor rodando em http://localhost:${PORT}`);
})