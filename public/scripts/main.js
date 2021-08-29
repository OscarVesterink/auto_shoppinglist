// Array for selection of days of the week
let daysOfWeekArray =   [['Monday', 0],
                        ['Tuesday', 1],
                        ['Wednesday', 2],
                        ['Thursday', 3],
                        ['Friday', 4],
                        ['Saturday', 5],
                        ['Sunday', 6]];
let dataWeekArray = '';
let dataRecipesArray = '';

setup();

function setup(){
    setupSelectArray();
    getJSON();
    selectGetRecipes();
    getOldJSON();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function setupSelectArray(){
    for(i=0;i<daysOfWeekArray.length;i++){
        let select = document.getElementById("selectStartOfWeek");
        select.options[select.options.length] = new Option(daysOfWeekArray[i][0], daysOfWeekArray[i][1]);
    }
}

// Listen to touch buttons
document.getElementById('updateDataButton').addEventListener('click', updateData);

document.getElementById('selectStartOfWeek').addEventListener('change', setSelectStartOfWeek);

function setSelectStartOfWeek(){
    sessionStorage.setItem('selectStartOfWeek', document.getElementById('selectStartOfWeek').value);

    fillInSchedule();
    setupRecipesArray(dataRecipesArray);
}

document.getElementById('updateOldDataButton').addEventListener('click', refreshOldJSON);

function refreshOldJSON(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/oldWeekSchedule/refresh";

    xhr.open('GET', url, true);

    //xhr.responseType = 'text';

    xhr.send();

    // The response is the old weekschedule
    xhr.onload = function() {
        let responseObj = xhr.response;
        let passThroughOldData = JSON.parse(responseObj);
        fillInOldSchedule(passThroughOldData.data);
    };
}

function getOldJSON(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/oldWeekSchedule";

    xhr.open('GET', url, true);

    //xhr.responseType = 'text';

    xhr.send();

    // The response is the old weekschedule
    xhr.onload = function() {
        let responseObj = xhr.response;
        let passThroughOldData = JSON.parse(responseObj);
        fillInOldSchedule(passThroughOldData.data);
    };
}

function fillInOldSchedule(dataArray){
    let table = document.createElement('table');
    table.setAttribute('id', 'oldShoppingListTable');
    for(i=0;i<dataArray.length;i++){
        let addItem = dataArray[i];
        let addRow = addRowColumn(addItem);
        table.appendChild(addRow);
    }
    if (document.getElementById('oldShoppingListTable')){
        document.getElementById('oldShoppingListTable').remove();
        
    }
    document.getElementById('shoppingListOld').appendChild(table);
}

function addRowColumn(data){
    let tR = document.createElement('tr');
    let tD1 = document.createElement('td');
    let tD2 = document.createElement('td');
    tD1.textContent = data.day;
    tD2.textContent = data.recipe;
    tR.appendChild(tD1);
    tR.appendChild(tD2);
    
    return tR;
}

//Setup the table with the desired starting day + select list with recipes
function fillInSchedule(){
    if (document.getElementById('tableWeekSchedule')){
        document.getElementById('tableWeekSchedule').remove();
    }
    head = '<table id = "tableWeekSchedule">';
    begin = '<tr><td ';
    intermediate = '</td><td><select style="width: max-content" ';
    end = '"><option value="none" selected hidden disabled>Please select recipe</option></select></td></tr>';
    footer = '</table>';
    add = 0;

    for(i=0;i<daysOfWeekArray.length;i++){
        y = Number(i) + Number(sessionStorage.selectStartOfWeek);
        if (y > 6){
            y = Number(i) + Number(sessionStorage.selectStartOfWeek) - 7;
        }
               
        if (add !== 0){
            add = add + begin + 'id = "day' + i + '">' + daysOfWeekArray[y][0] + intermediate + 'id = "selectDay' + i + end;
        }
        else{
            add = begin + 'id = "day' + i + '">' + daysOfWeekArray[y][0] + intermediate + 'id = "selectDay' + i + end;
        }
    }
    total = head + add + footer;
    document.getElementById('main').insertAdjacentHTML('beforeend', total);
    
    addSaveButton();
}


//Adding button to start writing JSON on to server
function addSaveButton(){
    el = '<button class="buttons" id="saveButton" type="button">Save schedule</button>';
    total = el;
    if (!document.getElementById('saveButton')){
    document.getElementById('footer').insertAdjacentHTML('afterbegin', total);
    }
}

document.getElementById('footer').addEventListener('click', collectData);

function collectData(){
    let collection = [];
    for(i=0;i<daysOfWeekArray.length;i++){
        adding = {
            "day": document.getElementById('day' + i).textContent,
            "recipe": document.getElementById('selectDay' + i).value
        };
        collection.push(adding);
    }       
    postJSON(collection);
}

//write JSON files for day of the week and chosen recipe
function postJSON(data){
       
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "/";

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

function getJSON(){
    let xhr = new XMLHttpRequest();
    let url = "/getData";

    xhr.open('GET', url, true);

    //xhr.responseType = 'text';

    xhr.send();

    // The response is the weekschedule
    xhr.onload = function() {
        let responseObj = xhr.response;
        let passThroughData = JSON.parse(responseObj);
        dataWeekArray = passThroughData.data;
        // console.log(dataArray.data); // console log incoming data
        // showSpecificRecipe(dataArray.data);
    };
}
// Log found recipe and recipe per day for the whole week as proof on concept for later use
function showSpecificDay(dataArray){
    // let recipeFind = dataArray.find(el => el.day === "Wednesday");
    // console.log(recipeFind["recipe"]);
    for(i=0;i<daysOfWeekArray.length;i++){
        if (dataArray[0].day == daysOfWeekArray[i][0]){
            sessionStorage.setItem('selectStartOfWeek', daysOfWeekArray[i][1]);
        }
    }
    document.getElementById('selectStartOfWeek').value = sessionStorage.selectStartOfWeek;
}

function showSpecificRecipe(dataArray){
    for(i=0;i<daysOfWeekArray.length;i++){
        // console.log(dataArray[i].recipe);
        document.getElementById('selectDay' + i).value = dataArray[i].recipe;
    }
}

// Adding recipes to select list
function selectGetRecipes(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/recipes";

    xhr.open('GET', url, true);

    //xhr.responseType = 'text';

    xhr.send();

    // The response is the weekschedule
    xhr.onload = function() {
        let responseObj = xhr.response;
        dataRecipesArray = JSON.parse(responseObj);
        setupRecipesArray(dataRecipesArray);
    };
}   
function setupRecipesArray(dataArray){
    if (document.getElementById("selectDay0")){
        for(i=0;i<daysOfWeekArray.length;i++){
            let select = document.getElementById("selectDay" + i);
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
            select.appendChild(optGroupAardappel);
            select.appendChild(optGroupPasta);
            select.appendChild(optGroupRijst);
            select.appendChild(optGroupOverig);
            }
        }
    }
}

function updateData(){
    showSpecificDay(dataWeekArray);
    fillInSchedule();
    setupRecipesArray(dataRecipesArray);
    showSpecificRecipe(dataWeekArray);
    window.alert("Save succesfull");
}