var express = require("express");
var http = require("http")
var path = require("path")
var nodemailer = require("nodemailer")

var app = express();
var server = http.Server(app)
var port = 500

app.set("port", port)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "static")))

//Routing
app.get("/", function(req, response){
    response.sendFile(path.join(__dirname, "static/index.html"))
})

app.post("/send_email", function(req, response){
  
})

//Initialize Web Server
server.listen(port, function(){
    console.log("starting server on port " + port)
})
console.clear()