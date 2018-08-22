const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mysql = require('mysql');

//conexion a la BD
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_writecode"
});

// Middleware
app.use(fileUpload());

//RUTA----para probar en postman
app.post('/cargar', function(req, res) {
    if (!req.files)
        return res.status(400).send('No se ha seleccionado ningun archivo');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //.samplefile es el name del input que carga la img
    let archivo = req.files.archivo;
    let nombreBase = archivo.name.split('.');
    let extension = nombreBase[nombreBase.length - 1];

    //extensionesPermitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //cambiar nombre al archivo
    let nombreArchivo = `${archivo.name}-${new Date().getMilliseconds() }.${extension}`;


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.send("extension no valida");
    }

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`cargar/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500).send(err);

        //res.send('archivo subido correctamente');
        var direccion = `cargar/${nombreArchivo}`;
        conexion.query("INSERT INTO tbl_archivo (codigo_propietario,nombre_archivo,Archivo,fecha_creacion) VALUES (?,?,?,sysdate())", [3, archivo.name, direccion], function(error, resultado) {
            console.log(resultado);
            if (error) {
                throw error
            } else {
                res.send(resultado);
            }
        })

    });


});

module.exports = app;