var width = 1496;
var height = 800;
var margin = 36;

var svg = d3.select("#vis")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background-color", "black")

var data = [];
d3.json("data.json").then(d => {
  data = d;
  draw();
});

function draw() {
  // axis
  var min = d3.min(data.map(d => d.steps));
  var max = d3.max(data.map(d => d.steps));
  var colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeSet3)

  var tickValues = d3.range(min, max+1, 10)
  var xScale = d3.scaleLinear()
    .domain([min, max])
    .range([margin, width-margin]);
  var xAxis = d3.axisBottom(xScale)
    .tickValues(tickValues);

  var axis = svg.append("g")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis)
    .attr("class", "axis");

  axis.selectAll("path, line")
    .style("stroke", "white")
  axis.selectAll("text")
    .style("fill", "white");

    //lines
    var linesGroup = svg.append("g").attr("class", "linesGroup")
    var lines = svg.selectAll(".linesGroup")
      .data(data)
      .join("g")
      .attr("transform", (d, i) => {
        let baseX = xScale(d.steps);
        let spacing = 8; 
        let offset = i * spacing;
        return `translate(${baseX + offset}, ${(height - margin) / 2})`;
        })
      //.attr("fill", d => colorScale(d.name));

    //bend-levels
    var lvl1 = "M0,-100 C0,-100 0,54 0,54"
    var lvl2 = "M0,-100 C30,-28 0,54 0,54"
    var lvl3 = "M0,-100 C0,-100 0,54 0,54"
    var lvl4 = "M0,-60 C130,-28 0,54 0,32"
    var lvl5 = "M200,0 L150,-50 M200,0 L150,50"

    //function which determines bend level 
    function generateBend(d) {
      switch(true) {
        case (d.raindrops <= 10):
          return lvl1;
        case (d.raindrops <= 20):
          return lvl2;
        case (d.raindrops <= 35):
          return lvl3;
        case (d.raindrops <= 50):
          return lvl4;
        case (d.raindrops > 50):
          return lvl5;
      }
    }

    //infobox for when hovering on lines
    var infobox = svg.append("g")
      .attr("class", "hoverbox")
      .style("opacity", 0);

    infobox.append("rect")
      .attr("class", "infoRect")
      .attr("width", 100)
      .attr("height", 40)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "white")
      .style("opacity", 0.15);

    var infoText = infobox.append("text")
      .attr("x", 15)
      .attr("y", 24)
      .style("font-size", 12)
      .style("fill", "white")
      .style("stroke", "white")
      .style("stroke-width", "0.55px");

    lines.append("path")
      .attr("d", d => generateBend(d))
      .attr("stroke", d => colorScale(d.name))
      .attr("stroke-width", 8)
      .on("mouseover", function(event, d) {
      //line hover effect
      d3.selectAll("path").style("opacity", 0.2);
      d3.select(this).style("opacity", 1);
      //infobox hover effect
      infobox.transition()
        .duration(100)
        .style("opacity", 1)
        .attr("transform", `translate(${event.pageX},${event.pageY - 50})`);
      infoText.text(`Raindrops: ${d.raindrops}`)
        .style("opacity", 1);
      })
      .on("mouseout", function(d, i) {
        d3.selectAll("path").transition().duration(400).style("opacity", 1)
        infobox.transition().duration(200).style("opacity", 0);
      })

    //legend
    var legendWidth = 160;
    var legendHeight = 96;

    var legendSvg = svg.append("svg")
      .attr("class", "legend")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("x", width-180)
      .attr("y", margin-14)

    legendSvg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "white")
      .style("opacity", 0.15)

    var legendText = legendSvg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("font-size", 12)
      .style("stroke-width", "0.55px")
    
    var names = data.map(d => d.name);
    var uniqueNames = new Set(names);
    var spacingText = 20;

    legendSvg.selectAll("text.legendText")
      .data([...uniqueNames])
      .enter()
      .append("text")
      .attr("x", 58)
      .attr("y", (d, i) => {return (i * spacingText)+20;})
      .style("fill", d => colorScale(d))
      .text(d => d)
    
}
