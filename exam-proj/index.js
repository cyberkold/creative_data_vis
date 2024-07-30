var width = 1200
var height = 800

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

//viz title
var vizTitle = svg.append("text")
  .attr("y", 30)
  .attr("x", width/2-360)
  .style("display", "block")
  .style("margin", "auto")
  .attr("fill", "white")
  .style("font-size", "34px")
  .text("Nature’s Fury: 43 Years of Global Disasters (1980-2023)")

//map
var projection = d3.geoNaturalEarth1()
  .scale(width/5.2)
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

  var toolTip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("height", "20px")
    .style("width", "120px")
    .style("text-align", "center")

  var popUp = d3.select("body").append("div")
    .attr("class", "popUp")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("left", "40%")
    .style("top", "50%")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")

  var popUpTitle = popUp.append("div")
    .attr("class", "popUp-content")
    .style("font-size", "26px")
    .style("text-align", "center")

  var popUpContent = popUp.append("div")
    .style("font-size", "14px")
    .style("text-align", "center")

  var ylabel = popUp.append("div")
    .style("font-size", "10px")
    .text("Number of disasters")
    .attr("fill", "black")
    .style("z-index", "10")
    .style("position", "absolute")
    .style("top", "116px")
    .style("left", "44px")

  var popUpGraph = d3.select(".popUp")
    .append("svg")
    .attr("class", "graph")

  var closeButton = d3.select(".popUp").append("button")
    .style("position", "absolute")
    .style("top", "3%")
    .style("left", "97%")
    .style("width", "12px")
    .style("height", "12px")
    .text("X")
    .style("text-align", "center")
    .style("padding", "0")
    .style("overflow", "hidden")
    .style("font-size", "8px")
    .style("cursor", "pointer")
    .on("click", function() {
      d3.select(".popUp")
        .style("opacity", 0)
        .style("width", "0px")
        .style("height", "0px")
      d3.select(".graph")
        .attr("width", 0)
        .attr("height", 0)
        
    })

  var popUpWidth = "1000px";
  var popUpHeight = "600px";
  //draw the map
  var countryPaths = svg.append("g")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
      .attr("d", path)
       .attr("fill", function(d) {
        var country = d.properties.name;
        var value = totals1980[country];
        var fillColor = value ? color(value) : "black";
        d.originalFill = fillColor;
        return fillColor;
       })
       .style("stroke", "#fff")
       .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .style("cursor", "pointer")
            .attr("fill", "grey")
          toolTip.transition()
            .duration(100)
            .style("width", "120px")
            .style("opacity", 0.9)
          toolTip.html(`${d.properties.name}`)
            .style("left", (event.pageX+5) + "px")
            .style("top", (event.pageY-28) + "px")
        })
        .on("mouseout", function(d) {
          var thisData = d.target.__data__
          d3.select(this)
            .transition()
            .attr("fill", thisData.originalFill)
          toolTip.transition()
            .style("opacity", 0)
        })
        .on("click", function(d) {
          var thisData = d.target.__data__
          popUp.transition()
            .duration(100)
            .style("opacity", 0.9)
            .style("display", "absolute")
            .style("left", "19%")
            .style("top", "12%")
            .style("height", popUpHeight)
            .style("width", popUpWidth)
          popUpGraph.transition()
            .attr("height", 560)
            .attr("width", 800)
            .attr("transform", "translate(50,30)");

          var disCountryValues;
          try {
            var selectedCountryData = disasterData.find(row => row.Country === thisData.properties.name && row.Year === (document.getElementById("slider").value));
            if (!selectedCountryData) {
              throw new Error("No data found");
            }
            disCountryValues = [
              { type: "Extreme temperature", value: parseFloat(selectedCountryData["Extreme temperature"]) || 0 },
              { type: "Drought", value: parseInt(selectedCountryData.Drought) || 0 },
              { type: "Flood", value: parseInt(selectedCountryData.Flood) || 0 },
              { type: "Storm", value: parseInt(selectedCountryData.Storm) || 0 },
              { type: "Landslide", value: parseInt(selectedCountryData.Landslide) || 0 },
              { type: "Wildfire", value: parseInt(selectedCountryData.Wildfire) || 0 }
            ];
          } catch (error) {
            console.log("Error: ", error.message);
            disCountryValues = [
              { type: "Extreme temperature", value: 0 },
              { type: "Drought", value: 0 },
              { type: "Flood", value: 0 },
              { type: "Storm", value: 0 },
              { type: "Landslide", value: 0 },
              { type: "Wildfire", value: 0 }
            ];
          }

          var margin = { top: 20, right: 20, bottom: 50, left: 40 };

          var xScale = d3.scaleBand()
            .domain(disCountryValues.map(d => d.type))
            .rangeRound([margin.left, 800 - margin.right])
            .padding(0.1);


          var y = d3.scaleLinear()
            .domain([0, 27])
            .range([510 - margin.bottom, margin.top])

          popUpGraph.selectAll("*").remove();

          var yAxis = d3.axisLeft(y)
            .ticks(30)
          
          var xAxis = d3.axisBottom(xScale);

          popUpGraph.append("g")
            .attr("transform", `translate(${margin.left},-10)`)
            .call(yAxis)

          popUpGraph.append("g")
            .attr("transform", `translate(10,${500 - margin.bottom})`)
            .call(xAxis)
            .append("text")
              .attr("dx", "-.8em")
              .attr("dy", ".90em")
          
          popUpGraph.selectAll("rect")
            .data(disCountryValues)
            .enter()
            .append("rect")
              .attr("x", d => xScale(d.type)+xScale.bandwidth() / 2 - 20)
              .attr("y", d => y(d.value))
              .attr("width", xScale.bandwidth()-50)
              .attr("height", d => 500 - margin.bottom - y(d.value))
              .attr("fill", "black")
              .on("mouseover", function(event, d) {
                d3.select(this)
                .transition()
                .style("cursor", "pointer")
                .attr("fill", "grey")
              toolTip.transition()
                .duration(100)
                .style("opacity", 0.9)
              toolTip.html(`${d.value}`)
                .style("left", (xScale(d.type) + xScale.bandwidth() / 2 + 280) + "px") // Adjust +10 as needed
                .style("top", (y(d.value) + 300) + "px")
                .style("z-index", "20")
                .style("width", "36px")
              })
              .on("mouseout", function() {
              toolTip.transition()
                .style("opacity", 0)
              d3.select(this)
                .attr("fill", "black")
              })

          popUpTitle.html(thisData.properties.name)
          popUpContent.html(`${document.getElementById("slider").value} <br> Lorem ipsum odor amet, consectetuer adipiscing, elit. Diam imperdiet ornare egestas a congue.
          Lorem ipsum odor amet, consectetuer adipiscing, elit. Diam imperdiet ornare egestas a congue. Lorem ipsum odor amet, consectetuer adipiscing, elit. Diam imperdiet 
          ornare egestas a congue. Lorem ipsum odor amet, consectetuer adipiscing, elit. Diam imperdiet ornare egestas a congue.`)
          
        })

    //function to get column for specific country and year, and retrieve the value
    /*function getDisValues(country, column) {
      var filteredData = disasterData.filter(function(row) {
        return row.Country === country && row.Year === (document.getElementById("slider").value);
      }).map(function(row) {
        return Math.floor(row[column]);
      })
        return filteredData.length > 0 ? filteredData[0] : 0;
      }*/
        

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
        var fillColor = value ? color(value) : "black";
        d.originalFill = fillColor;
        return fillColor;
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
      .style("position", "fixed")
      .style("top", "718px")
      .style("left", "50%")
      .style("transform", "translateX(-50%)");

  d3.select("#slider")
    .style("position", "fixed")
    .style("top", "780px")
    .style("left", "40%")
    .style("transform", "translateX(-140px)")
    .style("z-index", "10")
    .attr("min", minYear)
    .attr("max", maxYear)
    .attr("step", "1")
    .attr("value", "0")

  var legend = svg.append("g")
    .attr("class", "legend")

  var defs = svg.append("defs")
  var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")

  linearGradient
      .attr("x1", "0%")
      .attr("y1", "80%")
      .attr("x2", "100%")
      .attr("y2", "80%")

  linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white")
  linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "brown")

  legend.append("rect")
    .attr("width", 120)
    .attr("height", 20)
    .attr("x", 54)
    .attr("y", 376)
    .style("fill", "url(#linear-gradient)")

  legend.append("text")
    .attr("x", 0)
    .attr("y", 406)
    .style("font-size", 10)
    .style("font-style", "italic")
    .style("fill", "white")
    .style("font-family", "India")
    .attr("text-anchor", "middle")
    .selectAll("tspan")
    .data(["The color of the countries denotes the number", "of natural disasters in total. If the country has a", 
      "black color, it had 0 disasters in total that year."])
    .enter()
    .append("tspan")
    .attr("x", 110)
    .attr("dy", "12px")
    .text(d => d);

  legend.append("text")
    .attr("x", 10)
    .attr("y", 460)
    .style("font-size", 10)
    .style("fill", "white")
    .attr("text-anchor", "middle")
    .selectAll("tspan")
    .data(["Lorem ipsum odor amet, consectetuer adipiscing", "elit. Diam imperdiet ornare egestas a congue",
      "congue curabitur sit. Risus laoreet nam quam", "ultricies quisque inceptos. Enim torquent vitae", "rutrum ad tincidunt consectetur; proin montes.", 
      "Natoque mauris in; consequat fusce dui faucibus.", "Etiam suscipit posuere erat donec rhoncus", "scelerisque posuere.",
    "Lorem ipsum odor amet, consectetuer adipiscing", "elit. Diam imperdiet ornare egestas a congue",
      "congue curabitur sit. Risus laoreet nam quam", "ultricies quisque inceptos. Enim torquent vitae", "rutrum ad tincidunt consectetur; proin montes.", 
      "Natoque mauris in; consequat fusce dui faucibus.", "Etiam suscipit posuere erat donec rhoncus", "scelerisque posuere."])
    .enter()
    .append("tspan")
    .attr("x", 110)
    .attr("dy", "12px")
    .text(d => d);

});
