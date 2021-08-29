// Array for selection of type of ingredient
let typeOfIngredientArray =   [];
let listOfIngredientsArray = [];

const dataRecipeTypeArray = [['Rijst', "Wereldkeuken"],
                            ['Aardappel', "Groente"],
                            ['Pasta', "Wereldkeuken"],
                            ['Overig', "Overig"]];
// let dataWeekArray = '';
// let dataRecipesArray = '';

let rowCount = 1;

setup();

function setup(){
    getSelectArray();
    getListRecipeArray();
    getListIngredientsArray();
    let focusElement = document.getElementById('nameRecipe');
    focusElement.focus();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function getSelectArray(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/typeIngredient";
        
    xhr.open('GET', url, true);
        
    // xhr.responseType = 'text';
        
    xhr.send();
        
    // The response is the array with type of ingredients
    xhr.onload = function() {
        let responseObj = xhr.response;
        passThroughData = JSON.parse(responseObj);
        passThroughData.data.forEach( function(value){
            typeOfIngredientArray.push(value);
        })
        setupSelectArray(document.getElementById('typeIngredient0'));
    };
}

function getListRecipeArray(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/recipes";
        
    xhr.open('GET', url, true);
        
    // xhr.responseType = 'text';
        
    xhr.send();
        
    // The response is the array with type of ingredients
    xhr.onload = function() {
        let responseObj = xhr.response;
        let recipesData = JSON.parse(responseObj);
        setupListArray(recipesData);
    };
}

function getListIngredientsArray(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/ingredients";
        
    xhr.open('GET', url, true);
        
    // xhr.responseType = 'text';
        
    xhr.send();
        
    // The response is the array with type of ingredients
    xhr.onload = function() {
        let responseObj = xhr.response;
        listOfIngredientsArray = JSON.parse(responseObj);
    };
}

function setupSelectArray(selectList){
    for(i=0;i<typeOfIngredientArray.length;i++){
        selectList.options[selectList.options.length] = new Option(typeOfIngredientArray[i].type, typeOfIngredientArray[i].type);
    }
}

function setupListIngredients(data){
    let addDataList = document.getElementById('dataListIngredients');
    if (!addDataList.options.length > 0){
        for(i=0;i<data.length;i++){
            if (data[i].ingredients.length){
            // for(y=0;y<data[i].ingredients[y].length;y++){
                data[i].ingredients.forEach(function(item){
                    let addOption = document.createElement('option');
                    addOption.setAttribute('value', item);
                    addOption.textContent = item;
                    addDataList.appendChild(addOption);
                });
            }
        }
    }
}

// Autoselect type ingredient when first ingredient is selected
document.getElementById('addIngredientInput0').addEventListener('change', function(){
    const dataArray = dataRecipeTypeArray;

    dataArray.forEach(function(type){
        if (type[0] == document.getElementById('addIngredientInput0').value){
            document.getElementById('typeIngredient0').value = type[1];
        };
    });
});


document.getElementById('addRecipeTable').addEventListener('change', function(){
for(i=1;i<rowCount;i++){
        let valueInput = document.getElementById('addIngredientInput' + i);
        let setType = document.getElementById('typeIngredient' + i);
        for(y=0;y<listOfIngredientsArray.length;y++){
            listOfIngredientsArray[y].ingredients.forEach(function(item){
                if (valueInput.value == item){
                    setType.value = listOfIngredientsArray[y].type;
                }
            });
        }
    }
});

// Button to add row after the last existing row
document.getElementById('addIngredientRow').addEventListener('click', addRow);

// Listen to keypress 'Tab' to add ingredient ROW
document.getElementById('addRecipeTable').addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        addRow();
    }
});

function addRow(){
    let addTr = document.createElement('tr');
    let addTd0 = document.createElement('td');
    let addTd1 = document.createElement('td');
    let addOption = document.createElement('option');
    let addSelect = document.createElement('select');
    let addInput = document.createElement('input');
   
    addOption.setAttribute('style', 'width: max-content');
    addOption.setAttribute('selected', '');
    addOption.setAttribute('disabled', '');
    addOption.setAttribute('hidden', '');
    addOption.textContent = "Please select type";
    addSelect.setAttribute('id', 'typeIngredient' + rowCount);
    addInput.setAttribute('id', 'addIngredientInput' + rowCount);
    addInput.setAttribute('list', 'dataListIngredients');

    addSelect.appendChild(addOption);
    addTd0.appendChild(addSelect);
    addTd1.appendChild(addInput);
    
    addTd0.setAttribute('class', 'tablecell0');
    addTd1.setAttribute('class', 'tablecell0');

    addTr.appendChild(addTd0);
    addTr.appendChild(addTd1);

    document.getElementById('addRecipeTable').appendChild(addTr);
    setupSelectArray(document.getElementById('typeIngredient' + rowCount));
    setupListIngredients(listOfIngredientsArray);
    document.getElementById('addIngredientInput' + rowCount).focus();
    rowCount++;
}

// Button to delete last added row with blokkade to delete the rest of the table if no added row exists
document.getElementById('deleteIngredientRow').addEventListener('click', deleteRow);

function deleteRow(){
    if(rowCount > 1){
        document.getElementById('globalTable').deleteRow(2+rowCount);
        rowCount--;
    }
}

// Button to save recipe
document.getElementById('saveRecipe').addEventListener('click', collectData);

function collectData(){
    let nameRecipe = document.getElementById('nameRecipe');
    if (nameRecipe.value !== ''){
        let collection = [];
        let adding = [];
        adding = {
            "nameRecipe": document.getElementById('nameRecipe').value,
        }
        collection.push(adding);
        adding = {
            "typeRecipe": document.getElementById('addIngredientInput0').value,
        }
        collection.push(adding);
        let startingI = document.getElementById('addIngredientInput0').value == 'Overig' ? 1 : 0;
        for(i=startingI;i<rowCount;i++){
            adding = {
                "type": document.getElementById('typeIngredient' + i).value,
                "ingredient": document.getElementById('addIngredientInput' + i).value,
            };
            collection.push(adding);
        }
        postJSON(collection);
        window.location.reload(true);
    }
    else {
        window.alert("Please fill in the name for the recipe");
        nameRecipe.setAttribute('style', 'border-color: red')
    }
}

//write JSON files for day of the week and chosen recipe
function postJSON(data){
       
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "/saveRecipe";

    // open a connection
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Converting JSON data to string
    var dataDone = JSON.stringify({ 
        data
    });

    // Sending data with the request
    xhr.send(dataDone);
}

function setupListArray(dataArray){
    let datalist = document.getElementById("listRecipes");
    let optGroupRijst = document.createElement('optgroup');
    optGroupRijst.setAttribute('label', "Rijst");
    let optGroupAardappel = document.createElement('optgroup');
    optGroupAardappel.setAttribute('label', "Aardappel");
    let optGroupPasta = document.createElement('optgroup');
    optGroupPasta.setAttribute('label', "Pasta");
    let optGroupOverig = document.createElement('optgroup');
    optGroupOverig.setAttribute('label', "Overig");
    for(y=0;y<dataArray.length;y++){
        let optionText = dataArray[y].recipe;
        let optionValue = dataArray[y].recipe;
        if (dataArray[y].type == "Rijst"){
            optGroupRijst.appendChild(new Option(optionText, optionValue));
        }
        if (dataArray[y].type == "Aardappel"){
            optGroupAardappel.appendChild(new Option(optionText, optionValue));
        }
        if (dataArray[y].type == "Pasta"){
            optGroupPasta.appendChild(new Option(optionText, optionValue));
        }
        if (dataArray[y].type == "Overig"){
            optGroupOverig.appendChild(new Option(optionText, optionValue));
        }
    datalist.appendChild(optGroupAardappel);
    datalist.appendChild(optGroupPasta);
    datalist.appendChild(optGroupRijst);
    datalist.appendChild(optGroupOverig);
    }
}