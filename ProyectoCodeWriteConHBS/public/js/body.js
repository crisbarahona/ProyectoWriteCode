//funcion de carga el contenido en el tablero de body
$(document).ready(function() {
    cargarTablero()
});
//cargar tablero
function cargarTablero() {
    var css;
    $.ajax({
        url: "/miUnidad",
        method: "GET",
        success: function(response) {
            //console.log(response);
            let tbody = $('tbody'); // llenado de la tabla
            //tbody.html(''); //limpiar
            response.forEach((respuesta, index) => {
                if (respuesta.destacado == 1) {
                    css = "btn-warning";
                } else {
                    css = "noDestacado"
                }
                tbody.append(`
                    <tr idEliminar=${respuesta.codigo_archivo}">
                        <th scope="row">${index + 1}</th>
                        <td> 
                            ${respuesta.nombre_archivo}
                        </td>
                        <td>
                            ${respuesta.fecha_creacion}
                        </td>

                        <td>
                            <button class="btn btn-primary verArchivo" >Ver mas</button>

                            <button idEliminar=${respuesta.codigo_archivo} " class="btn btn-danger eliminarArchivo">Papelera</button>

                            <button idDestacado=${respuesta.codigo_archivo} type="button" class="btn destacado ${css}">Destacado</button>

                            <a href="/descargarArchivo/"><button idDescargar=${respuesta.codigo_archivo} type="button" class="btn btn-secondary ">Descargar</button></a>
                        </td>
                    </tr>
                `)
            });
        }

    });
}
//Boton Eliminar
// $(document).on('click', '.eliminarArchivo', function() {
//     let elemento = $(this)[0];
//     id = $(elemento).attr("idEliminar")
//     $.ajax({
//         url: "/eliminarArchivo/" + id,
//         method: "DELETE",
//         success: function(response) {
//             console.log(response)
//             cargarTablero();
//         }
//     })



//boton destacado
$(document).on("click", ".destacado", function() {

    let destacado = $(this)[0];
    $(destacado).toggleClass("btn-warning");
    let id = $(destacado).attr("idDestacado");
    var estado;
    if ($(destacado).hasClass("btn-warning")) {
        estado = 1;
    } else {
        estado = 0;
    }
    console.log(id);
    console.log(estado);

    let parametros = { id, estado }
    $.ajax({
        url: "/destacado/" + id + "/" + estado,
        method: "PUT",
        success: function(response) {}
    })
});

// //boton de almacenamiento
$("#almacenamiento").click(function() {
    //$("table").html("");
})

// //boton de compartir conmigo
$("#compartirConmigo").click(function() {
    // $("tbody").html("");

})

//Papelera de reciclaje
$("#papeleraReciclaje").click(function() {
    console.log("estoy aqui")
    $.ajax({
        url: "/papeleraReciclaje",
        method: "GET",
        success: function(response) {
            let tbody = $('tbody'); // llenado de la tabla
            //tbody.html(''); //limpiar
            tbody.html("")
            console.log(response)
            response.forEach((respuesta, index) => {
                tbody.append(`
                    <tr idEliminar=${respuesta.codigo_archivo}">
                        <th scope="row">${index + 1}</th>
                        <td> 
                            ${respuesta.nombre_archivo}
                        </td>
                        <td>
                            ${respuesta.fecha_creacion}
                        </td>

                        <td>
                            <button idEliminarRaiz=${respuesta.codigo_archivo} " class="btn btn-danger eliminarRaiz">Eliminar</button>
                            <button idRestaurar=${respuesta.codigo_archivo} type="button" class="btn  restaurarArchivo">Restaurar</button>
                        </td>
                    </tr>
                `)
            });

        }

    })
})

//Descargar archivo
//////////////////////////////////
/*$("#idDescargar").click(function(){
    $.ajax({
        url: "/descargarArchivo/" + id,
        method: "GET",
    });
})*/

//al momento de darle click en el div "mi unidad " en el tablero
$("#miUnidad").click(function() {
    $("tbody").html("");
    cargarTablero();
});

//boton de eliminar en el boton de la papelera
$(document).on('click', '.eliminarRaiz', function() {
    let elemento = $(this)[0]
    id = $(elemento).attr("idEliminarRaiz")
    $.ajax({
        url: "/eliminarArchivo/" + id,
        method: "DELETE",
        success: function(response) {
            console.log(response)
        }
    })
    $("tbody").html("")
    $("#papeleraReciclaje").click()
});


//eliminar archivo a papelera
$(document).on("click", ".eliminarArchivo", function() {
    let archivo = $(this)[0];
    let id = $(archivo).attr("idEliminar");
    let parametros = { id }
    $.ajax({
        url: "/enviaAPapelera",
        method: "POST",
        data: parametros,
        dataType: "json",
        success: function(response) {}

    })
    $("tbody").html("");
    cargarTablero();
})

//Boton restaurar archivos de papelera a mi unidad
$(document).on("click", ".restaurarArchivo", function() {
    let archivoRestaurar = $(this)[0];
    let id = $(archivoRestaurar).attr("idRestaurar")
    let parametros = { id }
    $.ajax({
        url: "/restaurarArchivo",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function(response) {

        }
    })
    $("tbody").html("");
    $("#papeleraReciclaje").click()
})

//Boton destacados
$("#destacado").click(function() {
    // $("tbody").html("")
    $.ajax({
        url: "/visualizarDestacados",
        method: "GET",
        success: function(response) {
            console.log(response);
            let tbody = $('tbody');
            tbody.html("");
            //let tbody = $('tbody');
            // llenado de la tabla
            //tbody.html(''); //limpiar
            response.forEach((respuesta, index) => {
                tbody.append(`
                    <tr idEliminar=${respuesta.codigo_archivo}">
                        <th scope="row">${index + 1}</th>
                        <td> 
                            ${respuesta.nombre_archivo}
                        </td>
                        <td>
                            ${respuesta.fecha_creacion}
                        </td>

                        <td>
                            <button class="btn btn-primary verArchivo" >Ver mas</button>
                            <button idEliminar=${respuesta.codigo_archivo} " class="btn btn-danger eliminarArchivo">Papelera</button>
                            <button idDestacado=${respuesta.codigo_archivo} type="button" class="btn destacado btn-warning">Destacado</button>
                            <button idDescargar=${respuesta.codigo_archivo} type="button" class="btn btn-secondary ">Descargar</button>
                        </td>
                    </tr>
                `)
            });
        }
    })
});