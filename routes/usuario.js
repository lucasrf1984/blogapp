const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model("usuario")
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        senha: req.body.senha
        
    }
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
            if(err)
            {
                req.flash("error_msg", "Erro ao definir senha."+err)
                res.redirect('/usuario/add-form')
            }
                novoUsuario.senha = hash

                new Usuario(novoUsuario).save().then(()=> {
                    req.flash("success_msg", "Usuario criado com sucesso!!!")
                    res.redirect('/usuario')
                }).catch((err)=> {
                    console.log("Erro ao criar nova postagem. "+err)
                    res.redirect('/usuario/add-form')            
                })
                })
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
            })
//Aplicando hash nas senhas:
bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.senha, salt, (err, hash) => {
        if(err)
        {
            req.flash("error_msg", "Erro ao definir senha."+err)
            res.redirect('/usuario/add-form')
        }
            usuarios.senha = hash
//codigo de persistencia abaixo

                usuarios.save().then(()=> {
                    req.flash("success_msg", "Usuario atualizado com sucesso!!!")
                    res.redirect('/usuario')
                     }).catch((err)=> {
                    req.flash("error_msg", "Falha ao realizar atualizaçao de usuario" +err)
                    res.redirect('.')
                })
            })
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

    router.get('/recuperar', (req,res)=> {
            res.render('usuarios/recuperar')
        })

    router.post('/email-find', (req,res)=>{
            Usuario.findOne({email: req.body.email}).then((usuarios)=> {

                if(usuarios)
                {
                    res.render('usuarios/troca-senha', {usuarios: usuarios.toJSON()})
                }else{
                    req.flash("error_msg", "Email não localizado")
                    res.redirect('recuperar')                       
                }
            })
        }) 
     
        router.post('/salvar-senha', (req,res)=>{
            Usuario.findOne({_id: req.body.id}).then((usuarios)=> {
                usuarios.senha = req.body.senha
//Criptografia da senha

bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(usuarios.senha, salt, (err, hash) => {
        if(err)
        {
            req.flash("error_msg", "Erro ao definir senha."+err)
            res.redirect('/usuario/add-form')
        }
            usuarios.senha = hash
//codigo de persistencia abaixo
usuarios.save().then(()=> {
    req.flash("success_msg", "Senha atualizada com sucesso!!!")
    res.redirect('/usuario')
}) }).catch((err)=> {
    req.flash("error_msg", "Falha ao realizar atualizaçao a senha" +err)
    res.redirect('.')
})
            })
            })
        })
module.exports = router;

