const express = require('express')
const app = express();

app.use('/', express.static(__dirname + '/'));
app.use('/documentation/', express.static(__dirname + '/documentation/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.get('/dashboard.html', function (req, res) {
  res.sendFile(__dirname + "/dashboard.html");
})
app.get('/table.html', function (req, res) {
  res.sendFile(__dirname + "/table.html");
})

app.get('/typography.html', function (req, res) {
  res.sendFile(__dirname + "/typography.html");
})

app.get('/user.html', function (req, res) {
  res.sendFile(__dirname + "/user.html");
})

app.get('/icons.html', function (req, res) {
  res.sendFile(__dirname + "/icons.html");
})


app.listen(3002, function () {
  console.log('Example app listening on port 3002!')
})