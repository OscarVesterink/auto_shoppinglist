const fs = require('fs');

// Write JSON file in folder with received data
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

function readJSON(){
    const dataContent = fs.readFileSync(__dirname + '/database/weekSchedule.json');
    // console.log('data = ', dataContent);
    return dataContent;
}

function readJSONRecipes(){
    const dataContent = fs.readFileSync(__dirname + '/database/defaultRecipes.json');
    console.log('data = ', dataContent);
    return dataContent;
}
// module.exports =
//     { writeJSON, readJSON, readJSONRecipes};

exports.writeJSON = writeJSON;
exports.readJSON = readJSON;
exports.readJSONRecipes = readJSONRecipes;