//Width and height
var w = 500;
var h = 500;



// vue app declaration 
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

// define sizes 
let centered = undefined;
const mapCenter = {
  lat: 1.4,
  lng: 117.5
};

// define colors
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
// .on('click', clicked);

const g = svg.append("g");

const effectLayer = g.append('g')
                    .classed('effect-layer', true);
const mapLayer = g.append('g')
                .classed('map-layer', true);

                

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


// ************************************************************************
//                Drawing the map
// ************************************************************************

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
            .enter().append('path') 
            .attr('d', path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('fill', fillFn)
              .on('mouseover', mouseover)
              .on('mouseout', mouseout)
              .on('click', clicked);

        d3.json("dataF.json", (data) => {
          fillSelect(data);
          daySelect();
          selecHour(data);
          getSalle(data, json)

        })
        });


        // svg.call(d3.zoom().extent())

        svg.call(d3.zoom().on('zoom', () => {
            console.log("zoomed");
            g.attr('transform', d3.event.transform);
        }));


function changeColor(){
  var x;
  var keyJ = arrSelectedVal["jour"];
  var keyH = arrSelectedVal["heure"];
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
function fillMap(salles){
    if(d.properties.name in salles){
      return mapLayer.attr("fill", "red")
    }
else mapLayer.attr("fill", fillFn);
}
// loading and processing data 
const loadAndProcessData = () => {

  d3.json("dataF.json", (data) => {
    getSalle(data);
    d3.select(path).attr('fill', changeColor())
    
  })
}
var selected = [];
document.getElementById('submit').onclick = function() {
  selected = []
  for (var option of document.getElementById('SpecID').options)
  {
      if (option.selected) {
          selected.push(option.value);
      }
  }
  for (var option of document.getElementById('day').options)
  {
      if (option.selected) {
          selected.push(option.value);
      }
  }
  for (var option of document.getElementById('Hour').options)
  {
      if (option.selected) {
          selected.push(option.value);
      }
  }
  specSelected();
  console.log(selected)
  // selected = []
}
const getSalle = (data, geojson, classrooms) => {
  var salle = []
  data.forEach(function (data){ 
    x = d3.values(data.Jour[selected[1]][selected[2]]);
    if(selected[0] == data.Filere)
    {
      fill(x, data, classrooms, "red");
    }
  });
  console.log(salle)
    salle.sort();
    return salle;
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
const fillSelect = (data)=>{
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
  console.log(specialites)
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

// get the selected speciality 
function specSelected()
{
  var objTable = []
  readTextFile("dataF.json", function(text)
    {
    var objTable = [];
    var data = JSON.parse(text);
    for (var i in data)
    {   
      if( trim(""+data[i].Filere) == selected[0])
      {
        for (const j in d3.range(0, 6)) {
          if (Object.keys(data[i].Jour)[j] == selected[1] ) {
            console.log(data[i])
            objTable.push(data[i])  
          }
        }
       
      }    
    }
    // console.log(objTable)
    // console.log(getSalle(objTable))
    // return getSalle(objTable);
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
function selecHour(data){
  objh = []
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

  
}

function trim(str){
  return str.trim().toUpperCase();
}
// ***************************************************************************
//                    interaction with the map
// ***************************************************************************

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
  } else {
    x = w / 2;
    y = h / 2;
    k = 1;
    centered = null;
    app.closeInfo();
  }

  // Highlight the clicked province
  mapLayer.selectAll('path')
    .style('fill', function(d){
      return centered && d===centered ? '#D5708B' : fillFn(d);
  });

  // Zoom
  g.transition()
    .duration(750)
    .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
}


function mouseover(d){
  // Highlight hovered area
  d3.select(this).style('fill', '#1483ce');
  if(d) {
    app.selectProvince(d.properties);
  }
}

function mouseout(d){
  app.selectProvince(undefined);
  // Reset area color
  mapLayer.selectAll('path')
    .style('fill', (d) => {
      return centered && d===centered ? '#D5708B' : fillFn(d);
    });
}

// Get area name length
function nameLength(d){
  const n = nameFn(d);
  return n ? n.length : 0;
}

// Get area name
function nameFn(d){
  return d && d.properties ? d.properties.name : null;
}

// Get area color
function fillFn(d){
  return color(nameLength(d));
}