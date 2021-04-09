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

router.get('/categorias/update/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categorias)=> {
        res.render('admin/editcategorias', {categorias: categorias.toJSON()})
      }).catch((erro)=> {
        req.flash("error_msg", "Erro ao atualizar categoria!!!"+erro)
        res.redirect('/admin/categorias')
      })
})

router.post('/categorias/update', (req,res)=>{

    Categoria.findOne({_id: req.body.id}).then((categorias) => {

        console.log(categorias.nome)
        console.log(categorias.slug)

        categorias.nome = req.body.nome
        categorias.slug = req.body.slug

        categorias.save().then(()=> {
            req.flash("success_msg", "Categoria atualizada com sucesso!!!")
            res.redirect('/admin/categorias')
    }).catch((err)=> {
        req.flash("error_msg", "Erro ao atualizar a categoria!!!")
        res.redirect('/admin/categorias')
        
    })
    })
})

router.get('/categorias/detail/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categorias)=> {
        res.render('admin/detailcategorias', {categorias: categorias.toJSON()})
      }).catch((erro)=> {
        req.flash("error_msg", "Erro ao abrir detalhes da categoria!!!"+erro)
        res.redirect('/admin/categorias')
      })
})

module.exports = router