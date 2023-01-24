// ====================================================================================
// definir les variables

var w = 700;
var h = 700;
var classrooms = [];
var selected = []

const app = new Vue({
    el: '#app',
    data: {
    province: undefined,
    currentProvince: undefined,
    },
    methods: {
    selectProvince(province) {
        this.province = province;
    },
    openInfo(province) {
        this.currentProvince = province;
    },
    closeInfo() {
        this.currentProvince = undefined;
    },
    },
});

let centered = undefined;
const mapCenter = {
  lat: 1.4,
  lng: 117.5
};

const color = d3.scale.linear()
  .domain([1, 20])
  .clamp(true)
  .range(['#08304b', '#08304b']);

//Define map projection
var proj = d3.geo.mercator()
                  .translate([0,0])
                  .scale([1]);

//Define path generator
var path = d3.geo.path()
                  .projection(proj);
                        
// create svg 
var svg = d3.select("svg")
            .attr("width", w)
            .attr("height", h);


// Add background
svg.append('rect')
.attr('class', 'background')
.attr('width', w)
.attr('height', h)

const g = svg.append("g");

const effectLayer = g.append('g')
                    .classed('effect-layer', true);
const mapLayer = g.append('g')
                .classed('map-layer', true);

let arraySpec = [];

// ===============================================================================================
// funtions 

// 1- remplir les select

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

function daySelect2(){
    var objTable = []
    readTextFile("dataF.json", function(text)
      {
          var data = JSON.parse(text);
              // console.log(Object.keys(data[i].Jour))
          objTable.push(Object.keys(data[0].Jour));
          objTable = objTable[0]
          console.log(objTable)
          let daySelect = document.getElementById('day2');
          for (var i = 0; i<objTable.length; i++)
            {
                var opt = document.createElement('option');
                // console.log(objTable[i])
                opt.value = objTable[i];
                opt.innerHTML = objTable[i];
                daySelect.appendChild(opt);
            }
      });
  }

  function daySelect(){
    var objTable = []
    readTextFile("dataF.json", function(text)
      {
          var data = JSON.parse(text);
              // console.log(Object.keys(data[i].Jour))
          objTable.push(Object.keys(data[0].Jour));
          objTable = objTable[0]
          console.log(objTable)
          let daySelect = document.getElementById('day');
          for (var i = 0; i<objTable.length; i++)
            {
                var opt = document.createElement('option');
                // console.log(objTable[i])
                opt.value = objTable[i];
                opt.innerHTML = objTable[i];
                daySelect.appendChild(opt);
            }
      });
  }
function selecHour2(){
    objh = []
    readTextFile("dataF.json", function(text)
      {
          var data = JSON.parse(text);
    objh.push(Object.keys(data[0].Jour.Sam));
    // objh = objh[0]
    console.log(objh)
    let daySelect = document.getElementById('Hour2');
          for (var i = 0; i<objh.length-1; i++)
            {
                var opt = document.createElement('option');
                // console.log(objTable[i])
                opt.value = objh[i];
                opt.innerHTML = objh[i];
                daySelect.appendChild(opt);
            }
        });
  
    
  }
  function selecHour(){
    objh = []
    readTextFile("dataF.json", function(text)
      {
          var data = JSON.parse(text);
    objh.push(Object.keys(data[0].Jour.Sam));
    objh = objh[0]
    console.log(objh)
    let daySelect = document.getElementById('Hour');
          for (var i = 0; i<objh.length; i++)
            {
                var opt = document.createElement('option');
                // console.log(objTable[i])
                opt.value = objh[i];
                opt.innerHTML = objh[i];
                daySelect.appendChild(opt);
            }
        });
  
    
  }

function trim(str){
    return str.trim().toUpperCase();
  }

const selectSpec = (data)=>{
    var specialites = []
    for (var i in data)
    {
        specialites.push(trim(data[i].Filere))
    }
    // remove duplicates
    var specialites = specialites.reduce(function (acc, curr) {
      if (!acc.includes(curr))
          acc.push(curr);
      return acc;
  }, [])
    // console.log(specialites)
    specialites.sort();
    specSelect = document.getElementById('SpecID');
      for (var i = 0; i<specialites.length; i++)
      {
          var opt = document.createElement('option');
          opt.value = specialites[i];
          opt.innerHTML = specialites[i];
          specSelect.appendChild(opt);
      }
  }

const SelectProf2 = (data)=>{
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

    profSelect = document.getElementById('IDProf');
    for (var i = 0; i<profs.length; i++)
    {
        var opt = document.createElement('option');
        opt.value = profs[i];
        opt.innerHTML = profs[i];
        profSelect.appendChild(opt);
    }
  }

// =============================================================================================
// remplir tableau des salles a partir des selects 
function getObjects(data, geojson, selected){
    var x;
    var keyJ = selected[1];
    var keyH = selected[2];
    resetColorClassrooms(geojson, classrooms, color);
    console.log(classrooms);
    classrooms.length = 0; // empty the classrooms array
    schedules.forEach(function (schedule){ 
        x = d3.values(schedule.Jour[keyJ][keyH]);
        if(arrSelectedVal["spec"] == schedule.Filere)
        {
            fill(x, schedule, classrooms, "#00FF00");
        }else{
            fill(x, schedule, classrooms, "#FF0000");
        }
    });
}

function resetColorClassrooms(geojson, classrooms, color, selected)
{
    console.log("i got into the reset color func")
    geojson.features.forEach(function(d){ 
        classrooms.forEach(function(salle){
            if(salle.nomSalle == String(d.properties.name))
            {
                mapLayer.select("#_"+salle.nomSalle)
                    .style('fill', color)
            }
        });
    });
    console.log("i got out yay !!!")
}

function colorClassrooms(geojson, classrooms)
{
    geojson.features.forEach(function(d){ 
        classrooms.forEach(function(salle){
            if(salle.nomSalle == String(d.properties.name))
            {
                mapLayer.select("#_"+salle.nomSalle)
                    .style('fill', salle.color)
            }
        });
    });
}


function fill(x, schedule, classrooms, color)
{
    var object = {};
    x.forEach(function(d){
            object = {
            speciality : schedule.Filere,
            grade : schedule.Grade,
            section : schedule.Section,
            module : d.Module,
            nomSalle : d.Salle,
            prof : d.Prof,
            groupe : d.Groupe,
            type : d.Type,
            color : color,
            heure : selected[2],
            jour : selected[1]
        };
        classrooms.push(object);
    });
}

function captUserValues(submit, selected, schedules, geojson)
{               
    console.log("here i am i got into the func")
    submit.onclick = function (){
        // while(selected.length ==0);
        selected = []
        for (var option of document.getElementById('SpecID').options)
        {
            if (option.selected) {
            // selected[0]= String(option.value)
                selected.push(option.value);
                }
        }
        for (var option of document.getElementById('day').options)
        {
            if (option.selected) {
            // selected[1]= String(option.value)
    
                selected.push(option.value);
            }
        }
        for (var option of document.getElementById('Hour').options)
        {
            if (option.selected) {
            // selected[2]= String(option.value)
                selected.push(option.value);
            }
        }
    // console.log(selected)
        console.log(selected)
        if(selected.length != 0)
        {
            filleClassroomsArr(schedules, geojson, '#FFFAFA', selected);
            colorClassrooms(geojson, classrooms, selected);
        }else{
            resetColorClassrooms(geojson, classrooms, '#FFFAFA', selected);
        }
        console.log("here i am i got out the func")
    }
        

}

// ==========================================================================================
// Get area name length
function nameLength(d){
    const n = nameFn(d);
    return n ? n.length : 0;
  }
// Get area name
function nameFn(d){
    return d && d.properties ? d.properties.name : null;
  }

function mouseover(d){
    // Highlight hovered area
    d3.select(this).style('fill', '#1483ce');
    if(d) {
      app.selectProvince(d.properties);
    }
  }
  
// Get area color
function fillFn(d){
return color(nameLength(d));
}
  
function mouseout(d){
    app.selectProvince(undefined);
    // Reset area color
    mapLayer.selectAll('path')
      .style('fill', (d) => {
        if(centered && d===centered){
            return '#D5708B';
        }else {
            return d.color;
        }
        // return centered && d===centered ?  : ;
      });
  }

function clicked(d) {
    var x, y, k;
  
    // Compute centroid of the selected path
    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
      app.openInfo(d.properties);
      getDetails(d.properties)
    //   console.log(salle)
    } else {
      x = w / 2;
      y = h / 2;
      k = 1;
      centered = null;
      app.closeInfo();
    }
  
    // Highlight the clicked province
    // mapLayer.selectAll('path')
    //   .style('fill', function(d){
    //     if(centered && d===centered){
    //         return '#D5708B'
    //     }
    // });
  
    // Zoom
    g.transition()
      .duration(750)
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
  }

function getDetails(d){
    let UListe = document.getElementById('liste');
    console.log(UListe)
    UListe.remove();
    let Div = document.getElementById('Division');
    var Uliste = document.createElement('ul');
    Uliste.setAttribute('id', 'liste');
    Div.appendChild(Uliste);

    classrooms.forEach(function(salle){
        if(salle.nomSalle == String(d.name))
        {
            console.log(salle)
            let LISTE = document.getElementById('liste');
            console.log(LISTE)
            for(let i in salle){
                var litem = document.createElement('li');
                // console.log(objTable[i])
                litem.value = i;
                console.log(String(i+" : "+ salle[i]))
                litem.innerHTML = String(i+" : "+ salle[i]);
                console.log(litem)
                LISTE.appendChild(litem);
            }        
        }
    })
}

function getSelectedValues(){
    selected = []
    for (var option of document.getElementById('SpecID').options)
    {
        if (option.selected) {
          // selected[0]= String(option.value)
            selected.push(option.value);
        }
    }
    for (var option of document.getElementById('day').options)
    {
        if (option.selected) {
          // selected[1]= String(option.value)
  
            selected.push(option.value);
        }
    }
    for (var option of document.getElementById('Hour').options)
    {
        if (option.selected) {
          // selected[2]= String(option.value)
            selected.push(option.value);
        }
    }
  //   specSelected();
    console.log(selected)
    // selected = []
  }
// document.getElementById('submit').onclick = getSelectedValues();

function filleClassroomsArr(schedules, geojson, color, selected)
        {
            console.log("filling classrooms")
            var x;
            console.log(selected)
            var keyJ = selected[1];
            var keyH = selected[2];
            console.log("shibal juuuuum")
            console.log(selected[1], selected[2])
            resetColorClassrooms(geojson, classrooms, color);
            console.log("classrooms======================");
            // console.log(classrooms)
            classrooms.length = 0; // empty the classrooms array
            schedules.forEach(function (schedule){ 
                x = d3.values(schedule.Jour[keyJ][keyH]);
                // console.log(x);
                if(selected[0] == schedule.Filere)
                {
                    fill(x, schedule, classrooms, "#00FF00");
                    console.log("hey this is first log showing classrooms")
                    console.log(classrooms);
                }else{
                    fill(x, schedule, classrooms, "#FF0000");
                }
            });
        }
// ==========================================================================================
// affichage

d3.json("usthbBrut2.geojson", function(json) {
    var b = path.bounds(json);
    // console.log(b);
        s = .99 / Math.max( (b[1][0] - b[0][0]) / w , (b[1][1] - b[0][1]) / h ); 
        t = [ (w - s * (b[1][0] +b[0][0])) / 2 , (h - s * (b[1][1]+b[0][1])) / 2 ];
        
        // Update color scale domain based on data
        color.domain([0, d3.max(json.features, nameLength)]);
        proj.translate(t).scale(s); 
        
        
        mapLayer.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
            .attr('d', path)
           .attr('class', 'bloc')
           .attr('cursor', 'pointer')
           .attr('id', function(d){
               return "_"+String(d.properties.name); //add id to svg path from the geojson file
           }) 
           .attr('stroke', 'black')
           .attr('stroke-width', '.4px')
           .style('fill', fillFn)
                .on('click', clicked);




        // ===================================================================================
        selecHour();
        daySelect();
        selecHour2();
        daySelect2();
       

        d3.json("dataF.json", (data) => {
            selectSpec(data);
            SelectProf2(data);
            
            console.log('helloooooo')
            var submit = document.getElementById("submit")
            console.log(submit)
            captUserValues(submit, selected, data, json)
                
          })
        });

svg.call(d3.zoom().on('zoom', () => {
    console.log("zoomed");
    g.attr('transform', d3.event.transform);
}));