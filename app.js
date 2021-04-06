// Carregando Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require("./routes/admin")
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')


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
    mongoose.connect("mongodb://localhost/testdb",
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
// Outros

const webport = 8081
app.listen(webport,() => {
    console.log("Server running, listening on port: "+webport);
})

module.exports = app