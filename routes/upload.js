/**
 * Para subir archivos
 *   npm install --save express-fileupload
 * Queda pendiente de validar si no existe el id que no suba 
 * ninguna imagen
 */

var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs'); // filesystem

var app = express();

// Importar modelso
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

// rutas next cuando se ejecute continue con la siguinte instruccion
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colleccione
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Las colecciones validas son : ' + tiposValidos.join(', ') }
        });
    }

    // Error
    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error no ha seleccionada nada',
            errors: { message: 'Debe seleccionar una imagen'}
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.'); // Genera un arreglo 
    var extensionArchivo = nombreCortado[nombreCortado.length -1]; // Obtiene la ultima posicion del arreglo con la extension

    // Solo estas extensiones son validas
    var extensionesVaidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesVaidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesVaidas.join(', ') }
        });
    }

    // Nombre archivo personalizado
    // id de usuario + numero random 1654648-6154646.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    // MOver el archivo a un path
    // crear carpeta upload con las carpetas usuario, medios, hospitales
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv( path, err => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, res );

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido con exito',
        //     nombreCortado: nombreCortado,
        //     extensionArchivo: extensionArchivo
        // });

    });

});

function subirPorTipo( tipo, id, nombreArchivo, res ){

    if ( tipo === 'usuarios' ){
        // recive id + callback
        Usuario.findById(id, (err, usuario) => {

            if ( !usuario ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img; // img = propiedad de la base de datos
            
            // si existe elimina la imagen antirior
            if( fs.existsSync(pathViejo) ){
                fs.unlinkSync( pathViejo );
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado,
                    errors: err
                });

            });

        });
    }

    if ( tipo === 'medicos' ){

        Medico.findById(id, (err, medico) => {

            if ( !medico ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img; // img = propiedad de la base de datos
            
            // si existe elimina la imagen antirior
            if( fs.existsSync(pathViejo) ){
                fs.unlinkSync( pathViejo );
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado,
                    errors: err
                });

            });

        });

    }
    if ( tipo === 'hospitales' ){

        Hospital.findById(id, (err, hospital) => {

            if ( !hospital ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img; // img = propiedad de la base de datos
            
            // si existe elimina la imagen antirior
            if( fs.existsSync(pathViejo) ){
                fs.unlinkSync( pathViejo );
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                hospitalActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    usuario: hospitalActualizado,
                    errors: err
                });

            });

        });

    }
}

module.exports = app;