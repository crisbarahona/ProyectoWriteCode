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

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.codigo_usuario);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        conexion.query("select * from tbl_usuario where codigo_usuario = " + id, function(err, rows) {
            done(err, rows[0]);
        });
    });


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    //Codigo para Registrar usuarios
    passport.use('registroEstrategia', new local({
            // by default, local strategy uses username and contrasena, we will override with correo
            usernameField: 'correoElectronico',
            passwordField: 'contrasena',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, correoElectronico, contrasena, done) {

            // find a user whose correo is the same as the forms correo
            // we are checking to see if the user trying to login already exists
            conexion.query("select * from tbl_usuario where correo = '" + correoElectronico + "'", function(err, rows) {
                console.log(rows);
                console.log("above row object");
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'El correo con el usuario ya existen'));
                } else {

                    // if there is no user with that correo
                    // create the user
                    var newUserMysql = new Object();

                    newUserMysql.correo = correoElectronico;
                    newUserMysql.contrasena = bcrypt.hashSync(contrasena, bcrypt.genSaltSync(10)); // use the generateHash function in our user model

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
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'correo',
                passwordField: 'contrasena',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, correo, contrasena, done) { // callback with email and password from our form
                conexion.query("SELECT * FROM tbl_usuario WHERE correo = ?", [correo], function(err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {

                        return done(null, false, req.flash('loginMessage', 'Usuario no encontrado')); // req.flash is the way to set flashdata using connect-flash
                    }
                    console.log(rows[0]);
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(contrasena, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'contrasena incorrecta')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
}