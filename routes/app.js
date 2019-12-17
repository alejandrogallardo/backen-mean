var express = require('express');

var app = express();

// rutas next cuando se ejecute continue con la siguinte instruccion
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

module.exports = app;