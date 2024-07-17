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
    .style("stroke", "white");
  axis.selectAll("text")
    .style("fill", "white");

    //lines
    var linesGroup = svg.append("g").attr("class", "linesGroup")
    var lines = svg.selectAll(".linesGroup")
      .data(data)
      .join("g")
      .attr("transform", (d, i) =>
        `translate(${xScale(d.steps)+((i+4)*10)}, ${(height - margin) / 2})`
      )
    //bend levels for lines
    //make a new json cat with bend level based on raindrops felt,
    //predefine the different bends for the lines

    //bendlevels
    var lvl1 = "M0,-100 C0,-100 0,54 0,54"
    var lvl2 = "M0,-100 C30,-28 0,54 0,54"
    var lvl3 = "M0,-100 C0,-100 0,54 0,54"
    var lvl4 = "M0,-60 C130,-28 0,54 0,32"
    var lvl5 = ""

    lines.append("path")
      .attr("d", "M0,0 L50,50 L100,0")
      .attr("stroke", "white")


}
