// Carregando Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const postagem = require('./routes/postagem')
const usuario = require('./routes/usuario')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const { restart } = require('nodemon')
require('./models/Postagem')
require('./models/Categoria')
const Postagem = mongoose.model("postagem")
const Categoria = mongoose.model("categoria")
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Configurações

    //Sessao
    app.use(cookieParser('test123'));
    app.use(session({
       secret: "test123",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
       next()
    })

    //BodyParser
    app.use(bodyparser.urlencoded({extended: true}))
    app.use(bodyparser.json())

    //HandleBars
    app.engine('handlebars',handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');

    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://192.168.100.78/testdb",
    {useNewUrlParser: true, useUnifiedTopology: true }).then(function()
    {
        console.log("MongoDB Connected!!!")
    }).catch(function(err){
        console.log("MongoDB Not due to ..."+err)
    })

    //Public (Static files)
    app.use(express.static(path.join(__dirname,"public")))
    app.use((req, res, next) => {
        next()
    })

// Rotas
    app.use('/admin',admin)
    app.use('/postagem',postagem)
    app.use('/usuario',usuario)

    app.get('/',(req,res)=> {
        Postagem.find().populate("categoria").sort({date:"desc"}).then((posts)=> {
            res.render('index', {posts: posts.map(posts => posts.toJSON())})
        }).catch((err)=> {
            req.flash(+err,"Erro ao listar postagens")
            res.render('index')
            res.render('/index')

        })
    })

    app.get('/detail/:_id', (req, res) => {
        Postagem.findOne(req.params.id).populate("categoria").sort({date: "desc"}).then((posts)=> {
            res.render('detail', {posts: posts.toJSON()})
          }).catch((erro)=> {
            req.flash("error_msg", "Erro ao abri detalhes!!!"+erro)
            res.redirect('/')
          })
    })

    app.get('/categoriaslist', (req,res) => {
        Postagem.find().then((categorias) => { 
        res.render('categorias', {categorias: categorias.toJSON()})
        res.render('categorias', {categorias: categorias.map(categorias => categorias.toJSON())})
    }).catch((erro)=> {
        req.flash("error_msg", "Erro ao listar categorias!!!"+erro)
        res.redirect('/')
    })
})
app.get('/categoria/filter/:slug', (req,res) => {
    console.log(req.params.slug)
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>  { 
            if(categoria)
            {
              Postagem.find({categoria: categoria._id }).then((posts)=> {
                res.render('categorias_filtered', {posts: posts.map(posts => posts.toJSON())})
              })
            }else {
                req.flash("error_msg", "Erro ao listar categorias!!!"+erro)
                res.redirect('/categoriaslist')
            }
    }).catch((erro)=> {
        req.flash("error_msg", "Erro ao listar categorias!!!"+erro)
        console.log(erro)
        res.redirect('/')
    })
})
// Outros

const webport = 8081
app.listen(webport,() => {
    console.log("Server running, listening on port: "+webport);
})

module.exports = app