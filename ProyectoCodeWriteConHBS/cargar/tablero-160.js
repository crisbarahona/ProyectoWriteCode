$("#miUnidad").click(function() {
    $("tbody").html("");
    cargarTablero();
});

$(document).on('click', function() {
    let elemento = $(this)[0]
    id = $(elemento).attr("idEliminarRaiz")
    $.ajax({
        url: "/eliminarArchivo/" + id,
        method: "DELETE",
        success: function(response) {
            console.log(response)
        }
    })