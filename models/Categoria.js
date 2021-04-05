const mongoose = require('mongoose')

const Categoria = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

// Collection (criando a tabela/Collection)
mongoose.model('categoria',Categoria)