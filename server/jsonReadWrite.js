const fs = require('fs');

// Write JSON file in folder with received data
function writeJSON(data){
    //if folder 'database' doesn't exist, make it.
    if (!fs.existsSync('./database')){
        fs.mkdirSync('./database');
    }

    const dataFinished = JSON.stringify(data);

    // Change existing file to name corresponding status
    transformNewToOld();
    
    //write weekschedule file
    fs.writeFile('./database/weekScheduleNew.json', dataFinished, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

function writeJSONRecipe(data){
    const dataRaw = data;
    //if folder 'recipe' doesn't exist, make it.
    if (!fs.existsSync('./database/recipes')){
        fs.mkdirSync('./database/recipes');
    }
    //write weekschedule file
    const dataFinished = JSON.stringify(data);
    fs.writeFile('./database/recipes/' + dataRaw.data[0].nameRecipe + '.json', dataFinished, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });

    let newIngredients = [];

    for(i=2;i<dataRaw.data.length;i++){  
        newIngredients.push(dataRaw.data[i]);
    }
    console.log(newIngredients);
    newIngredientsToBeAdded(newIngredients);
}

// To get saved weekschedule
function readJSON(){
    let dataContent = '';
    if (fs.existsSync('./database/weekScheduleNew.json') == false){
        dataContent = fs.readFileSync('./database/weekScheduleOld.json');
    }
    else{
        dataContent = fs.readFileSync('./database/weekScheduleNew.json');
    }

    // console.log('data = ', dataContent);
    return dataContent;
}

// To get saved old weekschedule
function readOldJSON(){
    const dataContent = fs.readFileSync('./database/weekScheduleOld.json');
    // console.log('data = ', dataContent);
    return dataContent;
}

// To get saved old weekschedule
function refreshOldJSON(){
    transformNewToOld();
    const dataContent = fs.readFileSync('./database/weekScheduleOld.json');
    // console.log('data = ', dataContent);
    return dataContent;
}

function transformNewToOld(){
    if (fs.existsSync('./database/weekScheduleNew.json')){
        fs.renameSync('./database/weekScheduleNew.json', './database/weekScheduleOld.json');
    }
    if (fs.existsSync('./database/groceryListNew.json')){
        fs.renameSync('./database/groceryListNew.json', './database/groceryListOld.json');
    }
}

// To get list of saved recipes
function readJSONRecipes(){
    let PATH = './database/recipes/';
    let dataRawArray = [];
    const files = fs.readdirSync(PATH);
    files.forEach(function(file){
        let dataFile = JSON.parse(fs.readFileSync(PATH + file));
        let adding = {
            "type": dataFile.data[1].typeRecipe,
            "recipe": dataFile.data[0].nameRecipe,
        }
        dataRawArray.push(adding);
    })
    let dataContent = JSON.stringify(dataRawArray);
    return dataContent;
}

// To get saved ingredients
function readJSONIngredients(){
    const dataContent = fs.readFileSync('./database/ingredients.json');

    // console.log('data = ', dataContent);
    return dataContent;
}

// Determine which recipe to get from database, to send ingredients in later stage
function getGroceryList(){
    let finalData = '';
    if (fs.existsSync('./database/groceryListNew.json')){
        finalData = fs.readFileSync('./database/groceryListNew.json');
    }
    else {
        finalData = setupGroceryList();
    }

    return finalData;
}

function setupGroceryList() {
    let rawListIngredient = [];
    let fineListIngredient = [];
    const dataWeekRaw = JSON.parse(readJSON());
    const dataWeekArray = dataWeekRaw.data;

    const dataTypeIngredientRaw = JSON.parse(getTypeIngredient());
    const dataTypeIngredientArray = dataTypeIngredientRaw.data;

    // Add lose ingredients to raw array
    for(i=0;i<dataWeekArray.length;i++){
        let recipeValue = dataWeekArray[i].recipe;
        if (recipeValue !== 'none'){
        let dataContent = JSON.parse(fs.readFileSync('./database/recipes/' + recipeValue + '.json'));
            for(y=2;y<dataContent.data.length;y++){
                let rawIngredients = dataContent.data[y];
                rawListIngredient.push(rawIngredients);
            }
        }
    }

    // Sort ingredients on type, create refined list
    for(i=0;i<dataTypeIngredientArray.length;i++){
        let tempArray = [];
        let checkListArray = [];
        for(y=0;y<rawListIngredient.length;y++){
            if (rawListIngredient[y].type == dataTypeIngredientArray[i].type){
                let amount = 1;
                for(z=(y+1);z<rawListIngredient.length;z++){
                    if (rawListIngredient[z].ingredient == rawListIngredient[y].ingredient){
                        amount++;
                    }
                }
                let infoIngredient = {
                    "ingredient": rawListIngredient[y].ingredient,
                    "amount": amount,
                    "checked": false,
                }
                if (!checkListArray.includes(rawListIngredient[y].ingredient)){
                    tempArray.push(infoIngredient);
                    checkListArray.push(infoIngredient.ingredient);
                }
            }
        }
        let addRefinement = {
            "type": dataTypeIngredientArray[i].type,
            "ingredients": tempArray,
        }
        fineListIngredient.push(addRefinement);
    }

    // const data = JSON.parse(fs.readFileSync('./database/groceryList.json'));

    const finalData = JSON.stringify(fineListIngredient);

    // fs.writeFile('./database/groceryList.json', finalData, (err) => {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log("JSON data is saved.");
    // });

    writeJSONGroceryList(finalData);

    return finalData;
}

// To get saved type of ingredients possible
function getTypeIngredient(){
    const dataContent = fs.readFileSync('./database/typeIngredientList.json');
    return dataContent;
}

function writePrepareJSONGroceryList(data){
    //if folder 'database' doesn't exist, make it.
    if (!fs.existsSync('./database')){
        fs.mkdirSync('./database');
    }
    let dataFinished = JSON.stringify(data.data);

    // Change existing file to name corresponding status
    // if (fs.existsSync('./database/groceryListNew.json')){
    //     fs.renameSync('./database/groceryListNew.json', './database/groceryListOld.json');
    // }

    writeJSONGroceryList(dataFinished);
}

function writeJSONGroceryList(data){
    //write grocery list file
    fs.writeFile('./database/groceryListNew.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("List of groceries is saved.");
    });
}

function newIngredientsToBeAdded(data){
    let rawListIngredient = [];
    console.log(data);

    const dataTypeIngredientRaw = JSON.parse(getTypeIngredient());
    const dataTypeIngredientArray = dataTypeIngredientRaw.data;
    let existingIngredients = [];
    if (fs.existsSync('./database/ingredients.json')){
        rawListIngredient = JSON.parse(fs.readFileSync('./database/ingredients.json'));

        for(i=0;i<dataTypeIngredientArray.length;i++){
            let tempArray = [];
            for(z=0;z<rawListIngredient.length;z++){
                if (rawListIngredient[z].type == dataTypeIngredientArray[i].type){
                    for(x=0;x<rawListIngredient[z].ingredients.length;x++){
                        tempArray.push(rawListIngredient[z].ingredients[x]);
                    }                    
                }
            }         

            for(y=0;y<data.length;y++){
                if(data[y].type == dataTypeIngredientArray[i].type && !(tempArray.includes(data[y].ingredient))){
                    tempArray.push(data[y].ingredient);
                }
            }
            let add = {
                "type": dataTypeIngredientArray[i].type,
                "ingredients": tempArray,
            }
            existingIngredients.push(add);
        }
    }
    else{
        for(i=0;i<dataTypeIngredientArray.length;i++){
            let tempArray = [];

            for(y=0;y<data.length;y++){
                if(data[y].type == dataTypeIngredientArray[i].type && !(tempArray.includes(data[y].ingredient))){
                    tempArray.push(data[y].ingredient);
                }
            }
            let add = {
                "type": dataTypeIngredientArray[i].type,
                "ingredients": tempArray,
            }
            existingIngredients.push(add);
        }

        // for(z=0;z<data.length;z++){
        //     if (existingIngredients.includes[data[z].type]){
        //         let index = existingIngredients.indexOf(data[z].type);
        //         existingIngredients[index].push(data[z].ingredient);
        //     }
        //     else{
        //         adding = {
        //             "type": data[z].type,
        //             "ingredients": data[z].ingredient,
        //         }
        //     }
        //     console.log('adding');
        //     existingIngredients.push(adding);
        // }
    }

    const stringifiedData = JSON.stringify(existingIngredients);

    fs.writeFileSync('./database/ingredients.json', stringifiedData, (err) => {
        if (err) {
            throw err;
        }
        console.log("List of ingredients is saved.");
    });

    console.log(existingIngredients);
}

// Exporting functions to be used in other files
exports.writeJSON = writeJSON;
exports.readJSON = readJSON;
exports.readJSONRecipes = readJSONRecipes;
exports.getGroceryList = getGroceryList;
exports.writeJSONRecipe = writeJSONRecipe;
exports.getTypeIngredient = getTypeIngredient;
exports.readOldJSON = readOldJSON;
exports.refreshOldJSON = refreshOldJSON;
exports.writePrepareJSONGroceryList = writePrepareJSONGroceryList;
exports.readJSONIngredients = readJSONIngredients;