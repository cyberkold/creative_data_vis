//GOAL: can we set up a local coding environment, webpage and draw 1 shape on it?

var width = 800;
var height = 500;
var xPos = width;
var yPos = height;
var rad = 1;

var canvas = d3.select("#myVis")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background-color", "steelblue");

 var circle1 = canvas.append("circle").classed("circ", true)
        .attr("cx", 100)
        .attr("cy", 250)
        .attr("r", 10)

var circle2 = canvas.append("circle").classed("circ", true)
        .attr("cx", 600)
        .attr("cy", 200)
        .attr("r", 20)

var circle3 = canvas.append("circle").classed("circ", true)
        .attr("cx", 400)
        .attr("cy", 400)
        .attr("r", 40)

function isPink(element) {
    return d3.select(element).style('fill') === 'pink';
}

d3.selectAll(".circ")
  .transition().duration(2000)
  .attr("r", function() {
    var curR = d3.select(this).attr('r')
    return curR*3
  });

d3.selectAll(".circ")
        .attr("fill","pink")
        .on('click', function(e, d) {
          if (isPink(this)) {
            d3.select(this).style("fill", "lightblue")
          } else {
            d3.select(this).style("fill", "pink")
          }
        })









































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