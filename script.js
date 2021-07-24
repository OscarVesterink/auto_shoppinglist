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
            add = add + begin + 'id = "day' + daysOfWeekArray[y][1] + '">' + daysOfWeekArray[y][0] + intermediate + 'id = "selectDay' + daysOfWeekArray[y][1] + end;
        }
        else{
            add = begin + 'id = "day' + daysOfWeekArray[y][1] + '">' + daysOfWeekArray[y][0] + intermediate + 'id = "selectDay' + daysOfWeekArray[y][1] + end;
        }
    }
    document.getElementById('main').insertAdjacentHTML('beforeend', head + add + footer);
    
}

window.addEventListener('click', checkSelectDay);

function checkSelectDay(){
    if (document.getElementById('tableWeekSchedule')){
        for(i=0;i<daysOfWeekArray.length;i++){
        variable = 'selectDay' + i;
        document.getElementById(variable).addEventListener('click', console.log(i));
        console.log('woepwoep');
        }
    }
}
