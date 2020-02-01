var express = require('express');

var app = express();

var path = require('path');
var fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;
    
    var pathImagen = path.resolve( __dirname, `../uploads/${tipo}/${img}`);

    if ( fs.existsSync( pathImagen ) ) {
        res.sendFile( pathImagen );
    } else {
        var pathNoImagen = path.resolve( __dirname, '../assets/no-img.png');
        res.sendFile(pathNoImagen);
    }

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Peticion realizada correctamente - Imagenes'
    // });
});

module.exports = app;