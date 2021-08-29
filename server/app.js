const jsonReadWrite = require("./jsonReadWrite");
const express = require("express");
const app = express(); 
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Send main website from folder 'public'
app.use('/', express.static('../public'));

// Send data in JSON file saved on server side
app.get('/getData', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.readJSON());
});

// Send old data in JSON file saved on server side
app.get('/getData/oldWeekSchedule', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.readOldJSON());
});

// Refresh and send 'new' old data in JSON file saved on server side
app.get('/getData/oldWeekSchedule/refresh', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.refreshOldJSON());
});

app.get('/getData/recipes', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.readJSONRecipes());
});

app.get('/getData/ingredients', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.readJSONIngredients());
});

// Receive weekschedule data in JSON string
app.post('/', function(req, res) {
    var rawData = req.body;
    // console.log(rawData);
    jsonReadWrite.writeJSON(rawData);
});

// Receive recipe data in JSON string
app.post('/saveRecipe', function(req, res) {
    var rawData = req.body;
    // console.log(rawData);
    jsonReadWrite.writeJSONRecipe(rawData);
});

// Receive recipe data in JSON string
app.post('/saveGroceryList', function(req, res) {
    var rawData = req.body;
    // console.log(rawData);
    jsonReadWrite.writePrepareJSONGroceryList(rawData);
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});

// return chosen recipe on wednesday
app.get('/getData/getGroceryList', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.getGroceryList());
});

// return chosen recipe on wednesday
app.get('/getData/typeIngredient', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.getTypeIngredient());
});