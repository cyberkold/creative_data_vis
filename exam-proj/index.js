var width = 1200
var height = 900

d3.select("body").style("background-color", "black");

var svg = d3.select("#vis")
  .append("svg")
  //.attr("viewBox", `0 0 ${width} ${height}`)
  //.attr("preserveAspectRatio", "xMidYMid meet")
  .attr("height", height)
  .attr("width", width)
  .style("display", "block")
  .style("margin", "auto")
  .style("background-color", "black")

//map
var projection = d3.geoNaturalEarth1()
  .scale(width/4.8)
  .translate([width/2, height/2]);

var path = d3.geoPath().projection(projection);

//GeoJSON data - countries of the world)
var geoDataUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

var dis_data = d3.csv("climate-dis-total.csv").then(function(disasterData) {

  //load data
  d3.json(geoDataUrl).then(function(data) {
  //find the initial colors to fill for 1980
  var totals1980 = {};
  disasterData.forEach(function(row) {
    if(row.Year === "1980") {
      totals1980[row.Country] = +row.Total;
    }
  });
  //draw the map
  var countryPaths = svg.append("g")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
      .attr("d", path)
       .attr("fill", function(d) {
        var country = d.properties.name;
        var value = totals1980[country];
        return value ? color(value) : "black";
       })
       .style("stroke", "#fff")
       .on("mouseover", function(d) {
          var thisData = d.target.__data__
          //console.log(thisData)

          d3.select(this)
          .transition()
          .attr("fill", "grey")
        })
        

  //event listener for slider
  var slider = document.getElementById("slider");

  slider.addEventListener("input", function() {
      var newYear = d3.select("#slider").node().value //set the new year variable to the value of the slider
      document.getElementById("sliderText").innerHTML = newYear; //set the slidertext value to the new year
  
      var totals = {}; //initialize empty object
      disasterData.forEach(function(row) { //go through each row in disaster data
        if(row.Year === newYear) { //check if the Year column of the row equals the year on the slider
            totals[row.Country] = +row.Total; //update the new data object to increase its Total column
        }
      });

      //fill based on value for the specific year that the slider is on
      countryPaths.attr("fill", function(d) {
        var country = d.properties.name;
        var value = totals[country]; //get value for the country (number of disasters for that country that specific year)
        return value ? color(value) : "black";
      });  
    });
  })

  var maxTotal = d3.max(disasterData, d => +d.Total)
  //colorscale
  var color = d3.scaleSequential(d3.interpolate("white", "brown")).domain([0, maxTotal]);

  //slider
  var maxYear = d3.max(disasterData, d => +d.Year)
  var minYear = d3.min(disasterData, d => +d.Year)

  var years = [... new Set(disasterData.map(d => +d.Year))]
  console.log(years)

  var sliderTextWidth = 54;
  d3.select("#sliderText")
    .style("font-size", "24px")
    .style("color", "white")
    .style("position", "absolute")
    .style("left", `calc(50% - ${sliderTextWidth / 2}px)`);

  d3.select("#slider")
    .style("display", "block")
    .style("margin", "0 auto")
    .attr("min", minYear)
    .attr("max", maxYear)
    .attr("step", "1")
    .attr("value", "0")

});
