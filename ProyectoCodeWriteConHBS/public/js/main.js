
$(function(){
    socket=io();
    //obteniendo los elementos del dom
    var formularioChat= $("#chatForm");
    var mensaje=$("#mensaje");
    var cajaMensajes=$("#chat");
    //nickname form
    const formularioLogin=$("#formularioLogin");
    const errorUsuario=$("#errorUsuario");
    const usuario=$("#usuario");
    const usuarios=$("#usuarios");


    formularioLogin.submit(function(e){
        e.preventDefault();
        socket.emit("nuevoUusuario",usuario.val(),function(data){
            if(data){
                $("#login").hide();
                $("#content").show();
            }else{
                $(errorUsuario).html(`<div class="alert alert-danger">
                El usuario ya existe</div>`)
            } 
            usuario.val("");
        });

    })

    
    formularioChat.submit(function(e){
        e.preventDefault();
        socket.emit("enviarMensaje",mensaje.val());
        mensaje.val("");
    });

    //eventos de recibir
    socket.on("NuevoMensaje",function(data){
    cajaMensajes.append(`${data.usuario}: ${data.mensaje} <br/>`);
    });
    socket.on("usuarios",function (data){
        let html="";
        for (let usuario of data){
            html+=`<p>${usuario}</>`
        }
        usuarios.html(html);
    });
});