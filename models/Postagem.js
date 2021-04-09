const mongoose = require('mongoose')

const Postagem = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categoria",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

// Collection (criando a tabela/Collection)
mongoose.model('postagem',Postagem)