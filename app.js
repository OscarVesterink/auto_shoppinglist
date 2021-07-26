const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express(); 
app.use(bodyParser.json());

//Load main website from folder 'public'
app.use('/', express.static(__dirname + '/public'));
// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
//     res.sendFile(__dirname + "/script.js");
//     res.sendFile(__dirname + "/styles.css");
// });

app.post('/', function(req, res) {
    var dog = req.body;
    console.log(dog);
    writeJSON(dog);
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});

function writeJSON(data){
    const dataFinished = JSON.stringify(data);
    fs.writeFile(__dirname + '/database/weekSchedule.json', dataFinished, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}