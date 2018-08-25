var editorCodeWrite = CodeMirror.fromTextArea(document.getElementById("txta-codeWrite"),
    //Json de configuracion
    {
        mode: "javascript",
        theme: "rubyblue",
        indentUnit: 3,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: { "Ctrl-Space": "autocomplete" },
        autoCloseTags: true
    },
);

//boton guardar
var btnGuardar = document.getElementById("btn-guardar");
btnGuardar.addEventListener("click", function() {
    let codigoEditor = editorCodeWrite.getValue();
    let nombre = $("#txt-nombreArchivo").val();
    editorCodeWrite.setValue("");
    parametros = { nombre, codigoEditor }
    $.ajax({
        url: "/codeWrite",
        dataType: "json",
        data: parametros,
        method: "POST",
        success: function(respuesta) {
            window.location.href = "/body";
            console.log(respuesta);
        }
    })
})