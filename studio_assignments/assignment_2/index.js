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
      .attr("transform", (d, i) => {
        let baseX = xScale(d.steps);
        let spacing = 4; 
        let offset = i * spacing;
        return `translate(${baseX + offset}, ${(height - margin) / 2})`;
    });

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

    lines.append("path")
      .attr("d", d => generateBend(d))
      .attr("stroke", "white")
      .attr("stroke-width", 8)


}
