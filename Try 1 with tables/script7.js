function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function trim(str){
    return str.trim().toUpperCase();
}

// select
readTextFile("dataF.json", function(text)
{
    var data = JSON.parse(text);
    // console.log("this is data ******",data)
    var profs = [];

    for (var i in data)
    {
        for (var j in data[i].Jour)
        {
            for (var k in data[i].Jour[j])
            {
                for (var l in data[i].Jour[j][k])
                {
                    if(profs.indexOf(trim(""+data[i].Jour[j][k][l].Prof)) === -1 && trim(""+data[i].Jour[j][k][l].Prof) != "" )
                    {
                        profs.push(trim(""+data[i].Jour[j][k][l].Prof))
                    }
                }
            }
        }
    }
    profs.sort();
    // console.log("this is profs *************",profs)

    profSelect = document.getElementById('profID');
    for (var i = 0; i<profs.length; i++)
    {
        var opt = document.createElement('option');
        opt.value = profs[i];
        opt.innerHTML = profs[i];
        profSelect.appendChild(opt);
    }

});


function profSelected()
{
    profSelect = document.getElementById('profID');
    edt = document.getElementById('edtText');

    edt.innerHTML = "<br>"
    console.log(profSelect.value)
    readTextFile("dataF.json", function(text)
    {
        var data = JSON.parse(text);
        for (var i in data)
        {
            for (var j in data[i].Jour)
            {
                for (var k in data[i].Jour[j])
                {
                    for (var l in data[i].Jour[j][k])
                    {
                        if( trim(""+data[i].Jour[j][k][l].Prof) == profSelect.value )
                        {
                            var sec = data[i].Section;
                            var fil = data[i].Filere ;
                            var gr = data[i].Grade;
                            var mod = data[i].Jour[j][k][l].Module;
                            var jour = j ;
                            var heure = k;
                            edt.innerHTML += sec+" "+fil+" "+gr+" "+mod+" "+jour+" "+heure+"<br>"
                        }
                    }
                }
            }
        }
        edt.innerHTML += "<br>"

    });
}

function switchDays(day)
{
    var j = 0 ;
    switch(day) {
      case "Sam":
        j = 1 
        break;
      case "Dim":
        j = 2 
        break;
      case "Lun":
        j = 3 
        break;
      case "Mar":
        j = 4 
        break;
      case "Mer":
        j = 5 
        break;
      case "Jeu":
        j = 6 
        break;
    }
    return j;
}

function switchHeure(heure)
{
    var j = 0 ;
    switch(heure) {
      case "08:00 - 09:30":
        j = 1 
        break;
      case "09:40 - 11:10":
        j = 2 
        break;
      case "11:20 - 12:50":
        j = 3 
        break;
      case "13:00 - 14:30":
        j = 4 
        break;
      case "14:40 - 16:10":
        j = 5 
        break;
      case "16:20 - 17:50":
        j = 6 
        break;
    }
    return j;
}

function clearTable()
{
    document.getElementById("table").innerHTML = "<table id='table' style='width:100%'> <tr> <th></th> <th>08:00 - 09:30</th> <th>09:40 - 11:10</th> <th>11:20 - 12:50</th> <th>13:00 - 14:30</th> <th>14:40 - 16:10</th> <th>16:20 - 17:50</th> </tr> <tr> <td>Sam</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td>Dim</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr><tr> <td>Lun</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td>Mar</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr><tr> <td>Mer</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td>Jeu</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> </table> </div>"
}



function profSelected2()
{
    clearTable();
    readTextFile("dataF.json", function(text)
    {
        var data = JSON.parse(text);
        for (var i in data)
        {
            for (var j in data[i].Jour)
            {
                for (var k in data[i].Jour[j])
                {
                    for (var l in data[i].Jour[j][k])
                    {
                        if( trim(""+data[i].Jour[j][k][l].Prof) == profSelect.value )
                        {
                            var sec = data[i].Section;
                            var fil = data[i].Filere ;
                            var gr = data[i].Grade;
                            var mod = data[i].Jour[j][k][l].Module;
                            var jour = j ;
                            var heure = k;
                            console.log(switchDays(jour))
                            var table = document.getElementById("table");
                            var row = table.getElementsByTagName("tr")[switchDays(jour)];
                            var td = row.getElementsByTagName("td")[switchHeure(heure)];

                            td.innerHTML = "<div>"
                            +"Section : "+fil+" "+gr+" "+sec+"<br>"
                            +"Module : "+mod+"<br>"
                            +"</div>"
                        }
                    }
                }
            }
        }
    });
}
