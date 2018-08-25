
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