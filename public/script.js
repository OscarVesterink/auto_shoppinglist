let daysOfWeekArray =   [['Monday', 0],
                        ['Tuesday', 1],
                        ['Wednesday', 2],
                        ['Thursday', 3],
                        ['Friday', 4],
                        ['Saturday', 5],
                        ['Sunday', 6]];

setup();

function setup(){
    setupSelectArray();
}

function setupSelectArray(){
    for(i=0;i<daysOfWeekArray.length;i++){
        let select = document.getElementById("selectStartOfWeek");
        select.options[select.options.length] = new Option(daysOfWeekArray[i][0], daysOfWeekArray[i][1]);
    }
}

document.getElementById('selectStartOfWeek').addEventListener('change', fillInSchedule);

//Setup the table with the desired starting day + select list with recipes
function fillInSchedule(){
    if (document.getElementById('tableWeekSchedule')){
        document.getElementById('tableWeekSchedule').remove();
    }
    sessionStorage.setItem('selectStartOfWeek', document.getElementById('selectStartOfWeek').value);
    head = '<table id = "tableWeekSchedule">';
    begin = '<tr><td ';
    intermediate = '</td><td><select ';
    end = '"><option value="first">First Value</option><option value="second" selected>Second Value</option><option value="third">Third Value</option></select></td></tr>';
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
    
    addFinishButton();
}


//Adding button to start writing JSON on to server
function addFinishButton(){
    el = '<button class="buttons" id="finishButton" type="button">Finish schedule</button>';
    total = el;
    if (!document.getElementById('finishButton')){
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
    let url = "http://localhost:3000/";

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
    let url = "http://localhost:3000/getData";

    xhr.open('GET', url, true);

    //xhr.responseType = 'text';

    xhr.send();

    // the response is the weekschedule
    xhr.onload = function() {
        let responseObj = xhr.response;
        jsonToData = JSON.parse(responseObj);
        console.log(jsonToData); // console log incoming data
        showSpecificDay(jsonToData);
    };
}
//Doesn't work, look into!
function showSpecificDay(jsonToData){
    for(i=0;i<jsonToData.length;i++){
        console.log(jsonToData[i].key);
        console.log(i);
    }
}