const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Postagem')
require('../models/Categoria')
const Postagem = mongoose.model("postagem")
const Categoria = mongoose.model("categoria")

router.get('/', (req,res)=> {
    Postagem.find().populate("categoria").sort({date:"desc"}).then((posts)=> {
        res.render('posts/list', {posts: posts.map(posts => posts.toJSON())})
    }).catch((err)=> {
        req.flash(+err,"Erro ao listar postagens")
        res.render('/postagem')
    })
})

router.get('/add', (req,res)=> {
    Categoria.find().then((categorias)=> {
        res.render('posts/postar',{categorias: categorias.map(categorias => categorias.toJSON())})
    })
    
})

router.post('/save', (req,res)=>{
    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
    }
    new Postagem(novaPostagem).save().then(()=> {
        req.flash("success_msg", "Postagem inserida com sucesso!!!")
        res.redirect('/postagem')
    }).catch((err)=> {
        console.log("Erro ao criar nova postagem. "+err)
        res.redirect('/postagem/add')
    })
})


router.get('/delete/:_id', (req, res) => {
    Postagem.deleteOne(req.params.id).then(()=> {
        req.flash("success_msg", "Categoria removido com sucesso!!!")
        res.redirect('/postagem')
      }).catch((erro)=> {
        req.flash("error_msg", "Erro ao remover categoria!!!"+erro)
        res.redirect('/postagem')
      })
})

router.get('/detail/:id', (req, res) => {
    Postagem.findOne({_id:req.params.id}).populate("categoria").sort({date:"desc"}).then((posts)=> {

        res.render('posts/detail', {posts: posts.toJSON()})
      }).catch((erro)=> {
        req.flash("error_msg", "Erro ao abrir detalhes da postagem!!!"+erro)
        res.redirect('/postagem')
      })
})

//Update

router.get('/update/:id', (req, res) => {
    Postagem.findOne({_id:req.params.id}).then((posts)=> {
        Categoria.find().then((categorias)=> {
            res.render('posts/edit', {posts: posts.toJSON(), categorias: categorias.map(categorias => categorias.toJSON())})
        }).catch((erro)=> {
            req.flash("error_msg", "Erro ao atualizar postagem!!!"+erro)
            res.redirect('/postagem')
      })
      })
    })

module.exports = router;