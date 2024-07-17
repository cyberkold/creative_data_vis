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
      .attr("transform", d =>
        `translate(${xScale(d.steps)}, ${(height - margin) / 2})`
      )

    lines.append("line")
      .attr("x1", 0)
      .attr("y1", -100)
      .attr("x2", 0)
      .attr("y2", 54)
      .attr("stroke", "white")

}
