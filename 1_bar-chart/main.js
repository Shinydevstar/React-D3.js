var margin = {
  top: 100, 
  bottom: 150, 
  right: 200, 
  left: 100},

width = 1535 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

const data = "http://localhost:8000/data/bar.csv";

function load_data(data){
  console.log('data', data)
  var data = d3.csv(data, d3.autoType).
  then(data)
  return data
}

function make_x_scale(){
  var x = d3.scaleBand()
          .range([0, width])
          .padding(0.5);
  return x
}

function make_y_scale(){
  var y = d3.sca leLinear()
            .range([height, 0]);
  return y
}

function select_html_element(selector){
  var svg = d3.select(selector).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return svg
}

function append_axis(svg_element){
  svg_element.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg_element.append("g")
    .call(d3.axisLeft(y));
}

d3.csv(data, d3.autoType)
  .then(data => {
    var x = make_x_scale()
    var y = make_y_scale()

    x.domain(data.map(function(d) { return d.country; }));
    y.domain([0, d3.max(data, function(d) { return d.out_num; })]);

    var svg = select_html_element(div_1)

    var g = svg.selectAll(".bar")
      .data(data)
      .enter().append("g")
    g.append("rect")
      .attr("class", "bar")
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.out_num); })
      .attr("x", function(d) { return x(d.country); })
      .attr("y", function(d) { return y(d.out_num); })
      g.append("text")
      .attr("class", "label")
      .attr("x", function(d) { return x(d.country); })
      .attr("y", barHeight / 2)
      .attr("y", function(d) { return y(d.out_num); })
      .text(function(d) {return d.out_num;});

    svg.append("g")
      .style("font", "14px times")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("y", height - 400)
      .attr("x", width + 150)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Country");
      
    svg.append("g")
      .style("font", "14px times")
      .call(d3.axisLeft(y)
      .tickFormat(function(d){
        return "$" + d;
      }).ticks(10))
      .append("text")
      // .attr("transform", "rotate(-90)")
      .attr("y", 35)
      .attr("dy", "-5.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("GDP");

});


