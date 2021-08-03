const jsonReadWrite = require("./jsonReadWrite");
// import { writeJSON, readJSON, readJSONRecipes} from './jsonReadWrite.js';
const express = require("express");
const app = express(); 
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Send main website from folder 'public'
app.use('/', express.static('C:/Users/ovest/Documents/Visual Studio Code/auto_shoppinglist/public'));

// Send data in JSON file saved on server side
app.get('/getData', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.readJSON());
    // console.log(readJSON());
    // fs.readFile(__dirname + '/database/weekSchedule.json', function (err, fileResp){
    //     res.setHeader('Content-type', 'application/json');
    //     res.send(fileResp);
    //     console.log(JSON.parse(fileResp));
    // });
});

app.get('/getData/recipes', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.send(jsonReadWrite.readJSONRecipes());
    // console.log(readJSON());
    // fs.readFile(__dirname + '/database/weekSchedule.json', function (err, fileResp){
    //     res.setHeader('Content-type', 'application/json');
    //     res.send(fileResp);
    //     console.log(JSON.parse(fileResp));
    // });
});

// Receive data in JSON string
app.post('/', function(req, res) {
    var rawData = req.body;
    // console.log(rawData);
    jsonReadWrite.writeJSON(rawData);
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});

// // Write JSON file in folder with received data
// function writeJSON(data){
//     //if folder 'database' doesn't exist, make it.
//     if (!fs.existsSync(__dirname + '/database')){
//         fs.mkdirSync('./database');
//     }
//     //write weekschedule file
//     const dataFinished = JSON.stringify(data);
//     fs.writeFile(__dirname + '/database/weekSchedule.json', dataFinished, (err) => {
//         if (err) {
//             throw err;
//         }
//         console.log("JSON data is saved.");
//     });
// }

// function readJSON(){
//     const dataContent = fs.readFileSync(__dirname + '/database/weekSchedule.json');
//     // console.log('data = ', dataContent);
//     return dataContent;
// }

// function readJSONRecipes(){
//     const dataContent = fs.readFileSync(__dirname + '/database/defaultRecipes.json');
//     console.log('data = ', dataContent);
//     return dataContent;
// }
