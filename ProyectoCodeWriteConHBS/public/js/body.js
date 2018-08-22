$(document).ready(function() {
    $.ajax({
        url: "/miUnidad",
        method: "GET",
        success: function(response) {
            //console.log(response);
            let tbody = $('tbody'); // llenado de la tabla
            //tbody.html(''); //limpiar
            response.forEach((respuesta, index) => {
                tbody.append(`
                    <tr>
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
                        </td>
                    </tr>
                `)
            });
        }

    });
});


//Boton Eliminar
$(document).on('click', '.eliminarArchivo', function() {
    let elemento = $(this)[0];
    id = $(elemento).attr("idEliminar")
    $.ajax({
        url: "/eliminarArchivo/" + id,
        method: "DELETE",
        success: function(response) {
            console.log(response)
        }
    })

})