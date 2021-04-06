const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categoria")

router.get('/', (req,res)=> {
    res.render('admin/index')
})

router.get('/posts', (req,res)=> {
    res.send("Exibindo posts do blog!")
})

router.get('/categorias', (req,res)=> {
    Categoria.find().then((categorias)=> {
        res.render('admin/categorias', {categorias: categorias.map(categorias => categorias.toJSON())})
    }).catch((err)=> {
        req.flash(+err,"Erro ao listar categorias")
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req,res)=> {
    res.render('admin/addcategorias')
})

router.post('/categorias/save', (req,res)=>{
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(()=> {
        res.render('admin/categorias')
    }).catch((err)=> {
        console.log("Erro ao criar nova categoria. "+err)
    })
})

router.get('/categorias/delete/:_id', (req, res) => {
    categorias.destroy({where: {'_id': req.params._id}}).then(()=> {
        res.render('admin/categorias', {categorias: categorias.map(categorias => categorias.toJSON())})
      }).catch((erro)=> {
        res.send("Não foi possivel remover o registro selecionado!!!"+erro);
      })
})
module.exports = router