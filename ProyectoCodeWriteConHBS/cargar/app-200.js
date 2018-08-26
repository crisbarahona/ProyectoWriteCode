
    app.get("/", function(req, res) {
    res.render("index");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/registrar", function(req, res) {
    res.render("registrar");
});