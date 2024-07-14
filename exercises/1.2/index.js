//GOAL: can we set up a local coding environment, webpage and draw 1 shape on it?

var width = 800;
var height = 500;
var xPos = width;
var yPos = height;
var rad = 1;

var canvas = d3.select("#vis")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background-color", "rgb(100, 100, 100, 0.1)");

var title = canvas.append("text")
        .attr("x", 120)
        .attr("y", 42)
        .attr("fill", "rgb(100, 100, 100")
        .style("font-size", 24)
        .text("People wearing headphones, looking at their phone or both")

title.append("tspan")
        .text("Spotted during a 15 min. walk")
        .style("font-size", 14)
        .attr("x", 308)
        .attr("dy", "1.6em");

var circle2 = canvas.append("circle").classed("bigCirc", true)
        .attr("cx", 400)
        .attr("cy", 250)
        .attr("r", 75.6)
        .attr("fill", "rgb(100, 200, 150)")
        .attr('stroke', 'black')

 var circle1 = canvas.append("circle")
        .attr("cx", 344)
        .attr("cy", 250)
        .attr("r", 18.9)
        .attr("fill", "steelblue")
        .attr('stroke', 'black')

var circle3 = canvas.append("circle")
        .attr("cx", 288)
        .attr("cy", 250)
        .attr("r", 75.6)
        .attr("fill", "rgb(100, 100, 100, 0.1)")
        .attr('stroke', "rgb(100, 100, 100, 0.2)")

var cmBar = canvas.append("rect")
        .attr("x", 20)
        .attr("y", 20)
        .attr("width", 37.8)
        .attr("height", 10)
        .attr("fill", "rgb(100, 100, 100, 0.8")
        .attr('stroke', 'black')

var barText = canvas.append("text")
        .attr("x", 24)
        .attr("y", 42)
        .attr("stroke", "rgb(100, 100, 100, 0.8")
        .style("font-size", 12)
        .text("1 cm.")

var tickSpacing = 37.8;
var numberOfTicks = Math.floor(width/tickSpacing);

const x = d3.scaleLinear()
        .domain([0, numberOfTicks])
        .range([0, width])

const xAxis = d3.axisBottom(x)
        .ticks(numberOfTicks);

canvas.append("g")
        .attr("transform", `translate(0, ${height-20})`)
        .call(xAxis);

var arrowHead = canvas.append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
      .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "black");

function getRadius(circ) {
  return d3.select(circ).attr("r")
}

var line1 = canvas.append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", function() {
          var r = parseFloat(getRadius(".bigCirc"));
          return width/2-r;
        })
        .attr("y1", 220)
        .attr("x2", function() {
          var r = parseFloat(getRadius(".bigCirc"));
          return width/2-r
        })
        .attr("y2", 460)
        .attr("marker-end", "url(#arrow)")

var line2 = canvas.append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", function() {
          var r = parseFloat(getRadius(".bigCirc"));
          return width/2+r;
        })
        .attr("y1", 220)
        .attr("x2", function() {
          var r = parseFloat(getRadius(".bigCirc"));
          return width/2+r
        })
        .attr("y2", 460)
        .attr("marker-end", "url(#arrow)")

var numberHeadP = canvas.append("text")
        .attr("x", 352)
        .attr("y", 400)
        .style("font-size", 12)

numberHeadP.append("tspan")
        .text("Headphones only = 4")
        .attr("fill", "rgb(100, 200, 150)")
        .attr("x", 352)
        .attr("dy", "1.2em");

numberHeadP.append("tspan")
        .text("Headphones + phone = 1")
        .attr("fill", "steelblue")
        .attr("x", 344)
        .attr("dy", "1.2em");

numberHeadP.append("tspan")
        .text("Looking at phone only = 0")
        .style("font-style", "italic")
        .attr("fill", "rgb(100, 100, 100, 0.7)")
        .attr("x", 340)
        .attr("dy", "1.2em");












































// var w = 500;
// var h = 500;
// var rad = 20;

// var svg = d3.select("svg")
// 			.attr("width",w)
// 			.attr("height",h);

// var circles = d3.selectAll("circle")
// 				.attr("r", rad)
// 				.attr("cx", w/2)
// 				.attr("cy", h/2);