$(document).ready(function() {
    cargarTablero()
});

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
                            <button idEliminar=${respuesta.codigo_archivo} " class="btn btn-danger eliminarArchivo">Eliminar</button>
                            <button idDestacado=${respuesta.codigo_archivo} type="button" class="btn destacado ${css}">Destacado</button>
                            <button idDescargar=${respuesta.codigo_archivo} type="button" class="btn btn-secondary ">Descargar</button>
                        </td>
                    </tr>
                `)
            });
        }

    });
}
//Boton Eliminar
/*$(document).on('click', '.eliminarArchivo', function() {
    let elemento = $(this)[0];
    id = $(elemento).attr("idEliminar")
    $.ajax({
        url: "/eliminarArchivo/" + id,
        method: "DELETE",
        success: function(response) {
            console.log(response)
            cargarTablero();
        }
    })

})*/

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


//visualizar destacados
//////////////////////////////////


//al momento de darle click en el div "mi unidad " en el tablero
$("#miUnidad").click(function() {
    $("tbody").html("");
    cargarTablero();
});

$(document).on('click', '.eliminarArchivo', function() {
    let elemento = $(this)[0].parentElement.parentElement;
    id = $(elemento).attr("idEliminar")

    $.ajax({
        url: "/eliminarArchivo/" + id,
        method: "DELETE",
        success: function(response) {
            console.log(response)
            cargarTablero();
        }
    })

});
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
                            <button idEliminar=${respuesta.codigo_archivo} " class="btn btn-danger eliminarArchivo">Eliminar</button>
                            <button idDestacado=${respuesta.codigo_archivo} type="button" class="btn destacado btn-warning">Destacado</button>
                            <button idDescargar=${respuesta.codigo_archivo} type="button" class="btn btn-secondary ">Descargar</button>
                        </td>
                    </tr>
                `)
            });
        }
    })
})