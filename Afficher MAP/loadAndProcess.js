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


// svg.call(d3.zoom()
// 	.extent([[0, 0], [w, h]])
// 	.scaleExtent([1, 8])
// 	.on("zoom", zoomed));

// function zoomed({transform}) {
// 	g.attr("transform", transform);
// }

// ************************************************************************
//                Drawing the map
// ************************************************************************

d3.json("usthbBrut2.geojson", function(json) {
    var b = path.bounds(json);
    // console.log(b);
        s = .99 / Math.max( (b[1][0] - b[0][0]) / w , (b[1][1] - b[0][1]) / h ); 
        t = [ (w - s * (b[1][0] +b[0][0])) / 2 , (h - s * (b[1][1]+b[0][1])) / 2 ];
        // console.log(s,t);
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
        
      // -------------------------------------------------------------------------
      //                        treating data of schedule
      // -------------------------------------------------------------------------

      // console.log("here is meeeeeeeeeeee",data)
      // let dimanche8 = d3.group(data, d => d.Jour.Dim[["08:00 - 09:30"]])
                  
        loadAndProcessData()
            
      
        
        });


        // svg.call(d3.zoom().extent())

        svg.call(d3.zoom().on('zoom', () => {
            console.log("zoomed");
            g.attr('transform', d3.event.transform);
        }));


// loading and processing data 

const loadAndProcessData = () => {

  d3.json("dataF.json", (data) => {
    getSalle(data);
    fillSelect(data);
    daySelect();
    // getSalle(objTable);
    // console.log(Object.keys(data[0].Jour)[0]);
  })
}
var selected = [];
document.getElementById('submit').onclick = function() {
  
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
  specSelected();
  console.log(selected)
  // alert(selected);
  // selected = []
}
const getSalle = (data) => {
  var salle = []
    for (var i in data)
    {
        for (var j in data[i].Jour)
        {
            for (var k in data[i].Jour[j])
            {
                for (var l in data[i].Jour[j][k])
                {
                    if(salle.indexOf(trim(""+data[i].Jour[j][k][l].Salle)) === -1 && trim(""+data[i].Jour[j][k][l].Salle) != "" )
                    {
                        salle.push(trim(""+data[i].Jour[j][k][l].Salle))
                    }
                }
            }
        }
    }
    salle.sort();
    // console.log(salle)
    return salle;
}


// la il me faut spliter la dataset pour que je puisse itterer les salles de chaque specialite
// il suffit juste de prendre le resultat d'un select, le retourner comme parametre dans une
//fonction pour remplir un tableau des objets specifiques, une fois selectionné on cherche les salles
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
      // console.log(data[i].Filere)
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

  //dealing with html selects
  specSelect = document.getElementById('SpecID');
  // console.log(specSelect)
    for (var i = 0; i<specialites.length; i++)
    {
        var opt = document.createElement('option');
        opt.value = specialites[i];
        opt.innerHTML = specialites[i];
        specSelect.appendChild(opt);
    }
  // return specialites;
}

// get the selected speciality 
function specSelected()
{
  var objTable = []
  readTextFile("dataF.json", function(text)
    {
    var objTable = [];
    var data = JSON.parse(text);
    // console.log(selected[0])
    for (var i in data)
    {   
      // console.log(selected[0])
      if( trim(""+data[i].Filere) == selected[0])
      {
        // console.log("hello there1")
        for (const j in d3.range(0, 6)) {
          if (Object.keys(data[i].Jour)[j] == selected[1] ) {
            // console.log("hello there2")
            console.log(data[i])
            // console.log(data[i].Filere);
            objTable.push(data[i])  
          }
        }
       
      }    
    }
    console.log(objTable)
    console.log(getSalle(objTable))
    return getSalle(objTable);
  });
    // console.log(objTable)
    // console.log(getSalle(objTable))
    
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