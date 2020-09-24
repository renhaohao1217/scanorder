var express = require('express')
var app = express()
var fs = require('fs')

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(process.env.PORT || 5050)
