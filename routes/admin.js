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
        req.flash("success_msg", "Categoria inserida com sucesso!!!")
        res.redirect('/admin/categorias')
    }).catch((err)=> {
        console.log("Erro ao criar nova categoria. "+err)
        res.redirect('/admin/categorias/add')
    })
})

router.get('/categorias/delete/:_id', (req, res) => {
    Categoria.deleteOne(req.params.id).then(()=> {
        req.flash("success_msg", "Categoria removido com sucesso!!!")
        res.redirect('/admin/categorias')
      }).catch((erro)=> {
        req.flash("error_msg", "Erro ao remover categoria!!!"+erro)
        res.redirect('/admin/categorias')
      })
})

router.get('/categorias/update/:_id', (req, res) => {
    Categoria.findById(req.params.id).then(()=> {
        res.redirect('/admin/editcategorias')
      }).catch((erro)=> {
        req.flash("error_msg", "Erro ao remover categoria!!!"+erro)
        res.redirect('/admin/categorias')
      })
})

router.post('/categorias/update', (req,res)=>{
    const updateCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(updateCategoria).updateOne().then(()=> {
        req.flash("success_msg", "Categoria atualizada com sucesso!!!")
        res.redirect('/admin/categorias')
    }).catch((err)=> {
        console.log("Erro ao atualizar categoria. "+err)
        res.redirect('/admin/categorias/add')
    })
})

module.exports = router