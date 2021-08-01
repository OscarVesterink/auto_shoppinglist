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

app.get('/getData', function(req, res) {
    fs.readFile(__dirname + '/database/weekSchedule.json', function (err, fileResp){
        res.setHeader('Content-type', 'application/json');
        res.send(JSON.parse(fileResp));
        console.log(JSON.parse(fileResp));
    });
});

app.post('/', function(req, res) {
    var rawData = req.body;
    console.log(rawData);
    writeJSON(rawData);
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});

function writeJSON(data){
    //if folder 'database' doesn't exist, make it.
    if (!fs.existsSync(__dirname + '/database')){
        fs.mkdirSync('./database');
    }
    //write weekschedule file
    const dataFinished = JSON.stringify(data);
    fs.writeFile(__dirname + '/database/weekSchedule.json', dataFinished, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}
