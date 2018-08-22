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
    res.render("body");
});

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

//funcion que no permite accesar a las demas rutas- la coloco en--app.get("/body", limitarRuta, function(req, res)
function limitarRuta(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

//Crear y levantar el servidor web.
app.listen(4500);
console.log("Servidor iniciado");
////////////////////////////////////////