const local = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');

//conexion a la BD
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_writecode"
});

module.exports = function(passport) {

    // serializar
    passport.serializeUser(function(user, done) {
        done(null, user.codigo_usuario);
    });

    // deserializar
    passport.deserializeUser(function(id, done) {
        conexion.query("select * from tbl_usuario where codigo_usuario = " + id, function(err, rows) {
            done(err, rows[0]);
        });
    });

    // Registrar usuarios
    passport.use('registroEstrategia', new local({
            usernameField: 'correoElectronico',
            passwordField: 'contrasena',
            passReqToCallback: true
        },
        function(req, correoElectronico, contrasena, done) {
            conexion.query("select * from tbl_usuario where correo = '" + correoElectronico + "'", function(err, rows) {
                console.log(rows);
                console.log("above row object");
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'El correo con el usuario ya existen'));
                } else {
                    var newUserMysql = new Object();

                    newUserMysql.correo = correoElectronico;
                    newUserMysql.contrasena = bcrypt.hashSync(contrasena, bcrypt.genSaltSync(10));

                    newUserMysql.nombre = req.body.nombre;
                    newUserMysql.apellido = req.body.apellido;
                    newUserMysql.codigo_almacenamiento = 1;

                    var insertQuery = "INSERT INTO tbl_usuario ( correo, password, nombre, apellido, codigo_almacenamiento) values ('" + correoElectronico + "','" + newUserMysql.contrasena + "','" + newUserMysql.nombre + "', '" + newUserMysql.apellido + "', '" + newUserMysql.codigo_almacenamiento + "')";
                    console.log(insertQuery);
                    conexion.query(insertQuery, function(err, rows) {
                        newUserMysql.codigo_usuario = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        }));

    passport.use('loginEstrategia',
        new local({
                usernameField: 'correo',
                passwordField: 'contrasena',
                passReqToCallback: true
            },
            function(req, correo, contrasena, done) {
                conexion.query("SELECT * FROM tbl_usuario WHERE correo = ?", [correo], function(err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {

                        return done(null, false, req.flash('loginMessage', 'Usuario no encontrado'));
                    }
                    console.log(rows[0]);
                    if (!bcrypt.compareSync(contrasena, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'contrasena incorrecta'));
                    return done(null, rows[0]);
                });
            })
    );
}