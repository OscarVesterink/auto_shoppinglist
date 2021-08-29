
// if(document.body != null){
//     document.body.appendChild(element);
// }
 let shoppingListArray = [];
 let listOfIngredientsArray = [];


setup();

function setup(){
    getShoppingList();
    getListIngredientsArray();

}

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function getShoppingList(){
    let xhr = new XMLHttpRequest();
    let url = "/getData/getGroceryList";

    xhr.open('GET', url, true);

    // xhr.responseType = 'text';

    xhr.send();

    // The response is the weekschedule
    xhr.onload = function() {
        let responseObj = xhr.response;
        shoppingListArray = JSON.parse(responseObj);
        arrToCheckBox(shoppingListArray);
        setupSelectArray(shoppingListArray);
        // console.log(dataArray.data); // console log incoming data
        // showSpecificDay(dataArray.data);
        // showSpecificRecipe(dataArray.data);
    };
}

function setupSelectArray(dataArray){
    for(i=0;i<dataArray.length;i++){
        let element = document.getElementById('typeIngredient');
        element.options[element.options.length] = new Option(dataArray[i].type, dataArray[i].type);
    }
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
        setupListIngredients(listOfIngredientsArray);
    };
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

document.getElementById('addAdditionalIngredient').addEventListener('change', function(){
    let valueInput = document.getElementById('addAdditionalIngredient');
    let setType = document.getElementById('typeIngredient');
    for(y=0;y<listOfIngredientsArray.length;y++){
        listOfIngredientsArray[y].ingredients.forEach(function(item){
            if (valueInput.value == item){
                setType.value = listOfIngredientsArray[y].type;
            }
        });
    }
});

// Listen to keypress 'ENTER' to add ingredient **IDEA create element after shoppinglist is present
document.getElementById('addAdditionalIngredient').addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        addAdditionalIngredientInput();
    }
});

// Add additional ingredient to existing list
function addAdditionalIngredientInput(){
        let typeIngredient = document.getElementById('typeIngredient').value;
        let amountIngredient = document.getElementById('amountIngredient').value;
        let nameIngredient = document.getElementById('addAdditionalIngredient').value;
        let table = document.getElementById('tableShoppingList' + typeIngredient);
        addIngredientToArray = {
            "ingredient": nameIngredient,
            "amount": amountIngredient,
            "checked": false,
        };
        let addRow = addRowColumn(addIngredientToArray);
        table.appendChild(addRow);
        for(i=0;i<shoppingListArray.length;i++){
            if (shoppingListArray[i].type === typeIngredient){
                shoppingListArray[i].ingredients.push(addIngredientToArray);
                break;
            }
        }
        postJSON(shoppingListArray);
        document.getElementById('typeIngredient').value = 0;
        document.getElementById('amountIngredient').value = 1;
        document.getElementById('addAdditionalIngredient').value = '';
}

function arrToCheckBox(array){
    for(i=0;i<array.length;i++){
        let table = document.createElement('table');
        table.setAttribute('id', 'tableShoppingList' + array[i].type);

        let tRHead = document.createElement('tr');
        let th = document.createElement('th');
        th.textContent = array[i].type;
        tRHead.appendChild(th);
        table.appendChild(tRHead);

        let arrayIngredientLength = array[i].ingredients.length
        if (arrayIngredientLength > 0){
            for(y=0;y<arrayIngredientLength;y++){
                let addItem = array[i].ingredients[y];
                // .amount + ' ' + array[i].ingredients[y].ingredient;
                let addRow = addRowColumn(addItem);
                table.appendChild(addRow);
            };
        };
        document.getElementById('shoppingList').appendChild(table);
    };
}

function addRowColumn(item){
    let title = item.amount + ' ' + item.ingredient;
    let tR = document.createElement('tr');
    let tD = document.createElement('td');
    let span = document.createElement('span');
    let checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('id', item.ingredient);
    span.setAttribute('for', item.ingredient);
    if (item.checked){
        checkBox.setAttribute('checked', true);
    }
    span.textContent = title;
    tD.appendChild(checkBox);
    tD.appendChild(span);
    tR.appendChild(tD);
    
    return tR;
}

//write JSON files for grocerylist
function postJSON(data){
       
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "/saveGroceryList";

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

document.getElementById('shoppingList').addEventListener('change', function(){
    for(i=0;i<shoppingListArray.length;i++){
        for(y=0;y<shoppingListArray[i].ingredients.length;y++){
            if (document.getElementById(shoppingListArray[i].ingredients[y].ingredient)){
                shoppingListArray[i].ingredients[y].checked = document.getElementById(shoppingListArray[i].ingredients[y].ingredient).checked;
            }
        }
    }
    postJSON(shoppingListArray);
})

document.getElementById('saveList').addEventListener('click', function(){
    if (shoppingListArray !== []){
        postJSON(shoppingListArray);
    }
});