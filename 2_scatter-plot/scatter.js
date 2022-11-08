const margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

function make_x_scale(){
    var x = d3.scaleBand()
            .range([0, width + 100])
            .padding(0.5);
    return x
}

function make_y_scale(){
    var y = d3.scaleLinear()
              .range([height, 0]);
    return y
}

d3.csv("http://localhost:8000/data/scatter.csv").then(function(data) {

    const allGroup = ["social_score", "corruption_rate", "GDP"]

    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(d => d)
      .attr("value", d => d)

    var x = make_x_scale()
    var y = make_y_scale()

    x.domain(data.map(function(d) { return d.country; }))
    y.domain([0, 100]);


    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .style("font", "16px times")
      .call(d3.axisBottom(x));

    svg.append("g")
      .style("font", "16px times")
      .call(d3.axisLeft(y));

    const line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(d => x(d.country))
            .y(d => y(d.social_score))
        )
        .attr("stroke", "black")
        .style("stroke-width", 4)
        .style("fill", "none")

    const dot = svg
        .selectAll('circle')
        .data(data)
        .join('circle')
            .attr("cx", d => x(d.country))
            .attr("cy", d => y(d.social_score))
            .attr("r", 7)
            .style("fill", "#69b3a2")

    function update(selectedGroup) {

      const dataFilter = data.map(function(d){return {country: d.country, value:d[selectedGroup]} })

      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(d => x(d.country))
            .y(d => y(d.value))
          )
      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", d => x(d.country))
          .attr("cy", d => y(d.value))
    }

    d3.select("#selectButton").on("change", function(event, d) {
        let selectedOption = d3.select(this).property("value")
        update(selectedOption)
    })

})