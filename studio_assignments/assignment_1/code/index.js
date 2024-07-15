var width = 1496;
var height = 800;
var xPos = width;
var yPos = height;
var rad = 1;

var canvas = d3.select("#vis")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background-color", "rgba(170, 193, 255, 0.56)");

var data = d3.json('data.json').then(data => {
  var times = data.map(d => d.time);
  const timesSet = new Set(times);

  var tickSpacing = 100;
  var numberOfTicks = timesSet.size;

  const x = d3.scaleLinear()
          .domain([0, numberOfTicks])
          .range([0, width-100])

  const xAxis = d3.axisBottom(x)
          .ticks(numberOfTicks)
          .tickFormat(function (d) {
            return (Array.from(timesSet))[d]}
          );

  canvas.append("g")
          .attr("transform", `translate(50, ${height-40})`)
          .call(xAxis);

  const y = d3.scaleLinear()
          .domain([0, 5])
          .range([height-100, 0])

  const yAxis = d3.axisLeft(y)
          .ticks(5)

  canvas.append("g")
          .attr("transform", "translate(32, 60)")
          .call(yAxis);

  var infoBox = canvas.append("rect")
          .attr("class", "box")
          .attr("height", 140)
          .attr("width", 110)
          .style("fill", "rgba(255, 255, 255, 0.6)")
          .style("opacity", 0)

  var textBox = canvas.append("text")
          .style("font-size", 12)
          .style("fill", "rgba(2, 38, 132, 0.91)")
          .style("stroke", "black")
          .style("stroke-width", "0.55px")
          .style("opacity", 0)

  var line1 = textBox.append("tspan")
  var line2 = textBox.append("tspan")
  var line3 = textBox.append("tspan")
  var line4 = textBox.append("tspan")

  function showInfo(xPos, yPos, d) {
    infoBox.transition()
            .duration(100)
            .style("opacity", 1)
            .attr("x", xPos+70)
            .attr("y", yPos+24)
    textBox.transition()
            .duration(100)
            .style("opacity", 1)
            .attr("x", xPos+74)
            .attr("y", yPos+36)

    line1.text(`Color: ${d.target.__data__.color}`).attr("dy", "0").attr("x", xPos+74);
    line2.text(`Sound: ${d.target.__data__.sound}`).attr("dy", "16").attr("x", xPos+74);
    line3.text(`Object: ${d.target.__data__.object || 'N/A'}`).attr("dy", "16").attr("x", xPos+74);
    line4.text(`Time: ${d.target.__data__.time}`).attr("dy", "16").attr("x", xPos+74);
  }

  function hideInfo() {
    infoBox.transition()
            .duration('200')
            .style("opacity", 0);
    textBox.transition()
            .duration('200')
            .style("opacity", 0)
  }

  function createShape(d) {
    var shape;
    const timeIndex = Array.from(timesSet).indexOf(d.time)
    const xPosition = x(timeIndex)
    const yPosition = y(d.sound) + 50;
    switch(d.shape) {
      case "fantasy":
        shape = d3.create("svg:circle");
        shape.attr("r", 10);
        shape.style("stroke", "black")
        shape.style("strokeWidth", "10px");
        shape.attr("cx", xPosition+50)
        shape.attr("cy", yPosition)
        shape.on("mouseover", function (d) {
          d3.select(this).transition()
            .duration("100")
            .attr("r", 16)
          showInfo(xPosition, yPosition, d)
        })
        shape.on("mouseout", function(d) {
          d3.select(this).transition()
            .duration("200")
            .attr("r", 10)
          hideInfo()
        })
        break;
      case "nature":
        shape = d3.create("svg:polygon");
        shape.attr("points", "-10,0 10,0 24,-24 -10,-28 -14,-20");
        shape.style("stroke", "black");
        shape.style("strokeWidth", "10px");
        shape.attr("transform", `translate(${xPosition+50}, ${yPosition})`);
        shape.on("mouseover", function (d) {
          d3.select(this).transition()
            .duration("100")
            .attr("points", "-20,0 40,0 44,-30 -10,-54 -14,-28")
          showInfo(xPosition, yPosition, d)
        })
        shape.on("mouseout", function(d) {
          d3.select(this).transition()
            .duration("200")
            .attr("points", "-10,0 10,0 24,-24 -10,-28 -14,-20");
          hideInfo()
        })
        break;
      case "human object":
        shape = d3.create("svg:rect");
        shape.attr("x", xPosition+35)
        shape.attr("y", yPosition)
        shape.attr("width", 30)
        shape.attr("height", 30)
        shape.style("stroke", "black")
        shape.style("strokeWidth", "10px");
        shape.on("mouseover", function (d) {
          d3.select(this).transition()
            .duration("100")
            .attr("width", 40)
            .attr("height", 40)
          showInfo(xPosition, yPosition, d)
        })
        shape.on("mouseout", function(d) {
          d3.select(this).transition()
            .duration("200")
            .attr("width", 30)
            .attr("height", 30)
          hideInfo()
        })
        break;
      case "animal":
        shape = d3.create("svg:ellipse");
        shape.attr("rx", 10)
        shape.attr("ry", 24)
        shape.attr("cx", xPosition+50)
        shape.attr("cy", yPosition)
        shape.style("stroke", "black")
        shape.style("strokeWidth", "10px");
        shape.on("mouseover", function (d) {
          d3.select(this).transition()
            .duration("100")
            .attr("rx", 20)
            .attr("ry", 44)
          showInfo(xPosition, yPosition, d)
        })
        shape.on("mouseout", function(d) {
          d3.select(this).transition()
            .duration("200")
            .attr("rx", 10)
            .attr("ry", 24)
            hideInfo()
        })
        break;
      default:
        shape = d3.create("svg:line");
        shape.attr("x1", xPosition+50)
        shape.attr("y1", yPosition)
        shape.attr("x2", xPosition+50)
        shape.attr("y2", `${height-160}`)
        shape.style("stroke", d.color)
        shape.style("stroke-width", "10px");
        shape.on("mouseover", function (d) {
          d3.select(this).transition()
            .duration("100")
            .style("stroke-width", "20px")
          showInfo(xPosition, yPosition, d)
        })
        shape.on("mouseout", function(d) {
          d3.select(this).transition()
            .duration("200")
            .style("stroke-width", "10px");
          hideInfo()
        })
        break;
    }
    shape.attr("class", "shape")
    shape.attr("fill", d.color)
    return shape.node()
  }

  var shapes = canvas.selectAll(".shape")
    .data(data)
    .enter()
    .append(d => createShape(d))

  var legend = canvas.append("g")
    .attr("class", "legend")

  legend.append("rect")
    .attr("x", width-250)
    .attr("y", 20)
    .attr("height", 60)
    .attr("width", 200)
    .style("fill", "rgba(255, 255, 255, 0.6)")

  const defs = canvas.append("defs")
  const linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")

  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")

  linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgba(84, 93, 216, 1)")
  linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(248, 247, 255, 1)")


  legend.append("ellipse")
    .attr("cx", width-100)
    .attr("cy", 50)
    .attr("rx", 24)
    .attr("ry", 24)
    .style("fill", "url(#linear-gradient)")

  var textLegend = legend.append("text")
    .attr("x", width-240)
    .attr("y", 46)
    .style("font-size", 12)
    .style("fill", "rgba(2, 38, 132, 0.91)")
    .style("stroke", "black")
    .style("stroke-width", "0.55px")

  textLegend.append("tspan")
    .text("Color of shapes denot-")

  textLegend.append("tspan")
    .text("es color of the sky.")
    .attr("x", 1257)
    .attr("dy", "1.2em")
  })



