
module.exports=function(io){
    let nicknames=[];
    io.on("connection",function(socket){
        console.log("Nuevo Usuario Conectado");
        socket.on("nuevoUusuario",(data,cb)=>{
            console.log(data);
            if(nicknames.indexOf(data)!=-1){
                cb(false);
            }else{
                cb(true);
                socket.nickname=data;
                nicknames.push(socket.nickname);
                io.sockets.emit("usuarios",nicknames);
            }
        });
        socket.on("enviarMensaje",function(mensaje){
             msg = mensaje.trim();
             if(msg.substr(0,3)==='/w '){
                 msg=msg.substr(3);
                 const index=msg.indexOf(" ")
                 if(index!=-1){
                     var name=msg.substring(0,index);
                     var msg=msg.substr(index+1);
                 }
             }
            io.sockets.emit("NuevoMensaje",{
                usuario:socket.nickname,
                mensaje:mensaje
            });
        });
        socket.on("disconnect",function(data){
            if(!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname),1);
            io.sockets.emit("usuarios",nicknames);
        });
    });
}