/////////////////////////////////////////
            //Servidor web en nodeJS para publicar archivos estaticos.
            var express = require("express");
            var app = express();

            //Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js
            app.use(express.static("www"));

            //Crear y levantar el servidor web.
            app.listen(4500);
            console.log("Servidor iniciado");
            ////////////////////////////////////////