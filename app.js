var express = require("express");
var fs = require("fs");
var path = require("path");
var app = express();


app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


//require('./characters.js').init(app);

app.listen(50001);

console.log("Server listenining at http://localhost:50001");