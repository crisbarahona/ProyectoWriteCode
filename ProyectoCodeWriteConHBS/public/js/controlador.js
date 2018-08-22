/*var expr = / ^ (( [ ^ <> () \ [\] \\ . ,;:: \ s @ "] + ( \. [ ^ <> () \ [\] \\ . ,;: \ s @ "] + ) * ) | (" . + ")) @ (( \ [ [ 0-9 ] {1,3} \. [ 0-9 ] {1,3} \. [ 0-9 ] { 1,3} \. [ 0-9 ] {1,3} \] ) | (( [ a-zA-Z \ -0 -9] + \. ) + [ a-zA-Z ] {2,} )) $ /;
$(document).ready(function() {
    //cuando de click que valide formulario
    $("#btnRegistrar").click(function() {
        var nombre = $("#nombre").val();
        var apellido = $("#apellido").val();
        var correo = $("#correoElectronico").val();
        var contrasena = $("#contrasena").val();
        //ahora a validar
        if (nombre == "") {
            $("#mensaje1").fadeIn();
            return false;
        } else {
            $("#mensaje1").fadeOut();
            if (apellido == "") {
                $("#mensaje2").fadeIn();
                return false;
            } else {
                $("#mensaje2").fadeOut();
            }
            if (correo == "" || !expr.test(correo)) {
                $("#mensaje3").fadeIn();
                return false;
            } else {
                $("#mensaje3").fadeOut();
                if (contrasena == "") {
                    $("#mensaje4").fadeIn();
                    return false;
                } else {
                    $("#mensaje4").fadeOut();
                }
            }
        }
    });
})*/

/*$("#btnRegistrar").click(function() {
    function validarCampoVacio(id) {
        if (document.getElementById(id).value == " ") {
            documento.getElementById(id).ClassList.remove(" es-válido ");
            documento.getElementById(id).ClassList.add("no es válido ");
        } else {
            documento.getElementById(id).ClassList.remove("no es válido ");
            documento.getElementById(id).ClassList.add(" es-válido ");
        }
    }

    function validarCorreo(etiqueta) {
        var re = / ^ (( [ ^ <> () \ [\] \\ . ,;:: \ s @ "] + ( \. [ ^ <> () \ [\] \\ . ,;: \ s @ "] + ) * ) | (" . + ")) @ (( \ [ [ 0-9 ] {1,3} \. [ 0-9 ] {1,3} \. [ 0-9 ] { 1,3} \. [ 0-9 ] {1,3} \] ) | (( [ a-zA-Z \ -0 -9] + \. ) + [ a-zA-Z ] {2,} )) $ /;
        if (ref.prueba(etiqueta.valor)) {
            etiqueta.ClassList.remove("no es válido ");
            etiqueta.ClassList.add(" es-válido ");
        } else {
            etiqueta.ClassList.remove(" es-válido ");
            etiqueta.ClassList.add("no es válido ");
        }
    }
})*/