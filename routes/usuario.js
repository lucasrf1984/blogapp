const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model("usuario")

router.get('/', (req, res) => {
    Usuario.find().then((usuarios)=> {
            res.render('usuarios/usuario_list', {usuarios: usuarios.map(usuarios => usuarios.toJSON())})
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar categorias!!!"+erro)
        res.redirect('/postagem')
}) 
}) 

router.get('/add-form', (req,res)=> {
    Usuario.find().then((usuarios)=> {
        res.render('usuarios/usuario_add',{usuarios: usuarios.map(usuarios => usuarios.toJSON())})
    })
    
})

router.post('/save', (req,res)=>{
    const novoUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
    }
    new Usuario(novoUsuario).save().then(()=> {
        req.flash("success_msg", "Usuario criado com sucesso!!!")
        res.redirect('/usuario')
    }).catch((err)=> {
        console.log("Erro ao criar nova postagem. "+err)
        res.redirect('/usuario/add-form')
    })
})

router.get('/update/:id', (req,res)=> {
    console.log(req.params.id)
    Usuario.findOne({_id: req.params.id}).then((usuarios) => {
        res.render('usuarios/update', {usuarios: usuarios.toJSON()})
    }).catch((err)=> {
        req.flash("error_msg", "Falha ao carregar atualizaçao de usuario")
        res.redirect('/usuario')
})
})

router.post('/update', (req,res)=>{
    Usuario.findOne(req.body.id).then((usuarios)=> {
        usuarios.nome = req.body.nome
        usuarios.email = req.body.email
        usuarios.senha = req.body.senha
        usuarios.save().then(()=> {
            req.flash("success_msg", "Usuario atualizado com sucesso!!!")
            res.redirect('/usuario')
        }) }).catch((err)=> {
            req.flash("error_msg", "Falha ao realizar atualizaçao de usuario" +err)
            res.redirect('.')
    })
    })

    router.get('/delete/:id', (req,res)=> {
        console.log(req.params.id)
        Usuario.deleteOne({_id: req.params.id}).then((usuarios) => {
            req.flash("success_msg", "Usuario removido com sucesso!!!")
            res.redirect('/usuario')
        }).catch((err)=> {
            req.flash("error_msg", "Falha ao carregar atualizaçao de usuario")
            res.redirect('/usuario')
    })
    })

    router.get('/detail/:id', (req,res)=> {
        console.log(req.params.id)
        Usuario.findOne({_id: req.params.id}).then((usuarios) => {
            res.render('usuarios/usuario_detail', {usuarios: usuarios.toJSON()})
        }).catch((err)=> {
            req.flash("error_msg", "Falha ao carregar detalhes do usuario")
            res.redirect('/usuario')
    })
    })
module.exports = router;

