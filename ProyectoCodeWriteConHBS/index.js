/////////////////////////////////////////
//Servidor web en nodeJS para publicar archivos estaticos.
var express = require("express");
var app = express();
const hbs = require('hbs');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mysql = require('mysql');
const fs = require("fs");

//Conexion a base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_writecode"
});

require("./passport/passport")(passport);
//Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js
app.use(express.static(path.join(__dirname, "public")));

//declaro el motor de plantillas a utilizar
app.set("view engine", "hbs");

//coloco los middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/");
})

//RUTAS-------renderizando la vistas
app.use(require("./cargar.js"));
//get
app.get("/", function(req, res) {
    res.render("index");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/registrar", function(req, res) {
    res.render("registrar");
});

app.get("/body", limitarRuta, function(req, res) {
    res.render("body", { user: req.user });
});

//ruta del editor--codeWrite 
app.get("/codeWrite", function(req, res) {
    res.render("codeWrite");
});

app.get("/miUnidad", function(req, res) {
    let codigoUsuario = req.session.passport.user;
    conexion.query(
        "SELECT codigo_archivo, codigo_propietario, nombre_archivo, fecha_creacion, destacado FROM tbl_archivo WHERE codigo_propietario = ?", [codigoUsuario],
        function(err, resultado) {
            if (err) {
                throw err;
            } else {
                //console.log(resultado);
                res.send(resultado);
            }
        }
    );
});

//Actualizar
app.put("/destacado/:id/:estado", function(req, res) {
    let id = req.params.id;
    let estado = req.params.estado;
    conexion.query("UPDATE tbl_archivo set destacado= ? WHERE codigo_archivo = ?", [estado, id],
        function(err, response) {
            if (err) {
                throw err
            } else {
                console.log(response);
            }
        });
});

app.get("/destacado", function(req, res) {
    let usuario = req.session.passport.user;
    conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, fecha_creacion, destacado FROM tbl_archivo WHERE codigo_propietario = ? AND destacado =?", [usuario, true], function(err, response) {
        if (err) {
            throw err
        } else {
            res.send(resultado);
        }
    });
});

app.get("/visualizarDestacados", function(req, res) {
    let propietario = req.session.passport.user;
    conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, fecha_creacion, destacado FROM tbl_archivo WHERE codigo_propietario = ? AND destacado =?", [propietario, true],
        function(err, resultado) {
            if (err) {
                throw err
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
})

//Boton Eliminar archivo del Tablero de Mi Unidad
app.delete("/eliminarArchivo/:id", function(req, res) {
    const { id } = req.params;
    console.log(id);
    conexion.query(
        "SELECT codigo_archivo, Archivo FROM tbl_archivo WHERE codigo_archivo = ?", [id],
        function(err, response) {
            if (err) {
                throw err
            } else {
                EditorArchivo = response[0].Archivo;

                fs.unlink(EditorArchivo, function(err) {
                    if (err) {
                        throw err
                    } else {
                        conexion.query("DELETE FROM tbl_archivo WHERE codigo_archivo=?", [id],
                            function(err, resultado) {
                                if (err) {
                                    throw err
                                } else {
                                    res.send(resultado)
                                }

                            })
                    }
                })

            }

        }
    );
})

//post
app.post("/registrar", passport.authenticate("registroEstrategia", {
    successRedirect: "/body",
    failureRedirect: "/registrar",
    failureflash: true
}));

app.post("/login", passport.authenticate("loginEstrategia", {
    successRedirect: "/body",
    failureRedirect: "/login",
    failureflash: true
}));

//FUNCIONES
//funcion que no permite accesar a las demas rutas- la coloco en--app.get("/body", limitarRuta, function(req, res)
function limitarRuta(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

//Insertar Archivos (Editor CodeWrite)
app.post("/codeWrite", function(req, res) {
    let codigoPropietario = req.session.passport.user;
    const { nombre, codigoEditor } = req.body; //guardar nombre y contenido
    let archivo = nombre.split(".");
    let extensionArchivo = archivo[archivo.length - 1];
    let nombreRuta = `${archivo[0]}-${new Date().getMilliseconds()}.${extensionArchivo}`
    fs.appendFile(`cargar/${nombreRuta}`, codigoEditor, function(err) {
        if (err) throw err
    });
    let direccionBase = `cargar/${nombreRuta}`;
    conexion.query("INSERT INTO tbl_archivo (codigo_propietario,nombre_archivo,Archivo,fecha_creacion) VALUES (?,?,?,sysdate())", [codigoPropietario, nombre, direccionBase],
        function(err, resultado) {
            if (err) {
                throw err
            } else {
                res.send(resultado);
            }
        });
});




//Crear y levantar el servidor web.
app.listen(4500);
console.log("Servidor iniciado");
////////////////////////////////////////