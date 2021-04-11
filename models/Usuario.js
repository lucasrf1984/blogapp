const mongoose = require('mongoose')

const Usuario = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmn: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

// Collection (criando a tabela/Collection)
mongoose.model('usuario',Usuario)