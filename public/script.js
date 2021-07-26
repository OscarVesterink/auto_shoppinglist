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

document.getElementById('footer').addEventListener('click', writeJSON);

//write JSON files for day of the week and chosen recipe
function writeJSON(){
       
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "http://localhost:3000/";

    // open a connection
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Converting JSON data to string
    var data = JSON.stringify({ 
        "name": "Snoopy", 
        "email": "Europese zwarte kortharige" 
    });

    // Sending data with the request
    xhr.send(data);
}
    // if (document.getElementById('tableWeekSchedule')){
    //     for(i=0;i<daysOfWeekArray.length;i++){
            // const fs = require('fs');

            // const dayValue = {
            //     "day": document.getElementById('day' + i).textContent,
            //     "value": document.getElementById('selectDay' + i).value,
            // };

            // const data = JSON.stringify(dayValue);
            // nameFile = document.getElementById('day' + i).textContent + '.json';
            // fs.writeFile(nameFile, data, (err) => {
            //     if (err){
            //         throw err;
            //     }
            //     console.log(nameFile, 'is saved');
            // });
            // console.log(document.getElementById('day' + i).textContent + document.getElementById('selectDay' + i).value);
        // }
    // }