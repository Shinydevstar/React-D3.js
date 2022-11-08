const x_label = "Year";
const y_label = "Generosity";
const location_name = "Afganistan";

const margin = { left: 120, right: 30, top: 60, bottom: 30 },
  width = document.querySelector("body").clientWidth,
  height = 500;

const svg = d3.select("svg").attr("viewBox", [0, 0, width, height]);

const label = svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "22px")
  .text(`${y_label} of ${location_name}`);

svg
  .append("text")
  .attr("text-ancho", "middle")
  .attr(
    "transform",
    `translate(${margin.left - 70}, ${
      (height - margin.top - margin.bottom + 180)/2
    }) rotate(-90)`
  )
  .style("font-size", "26px")
  .text(y_label);

svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", height - margin.bottom - margin.top + 60)
  .attr("text-anchor", "middle")
  .style("font-size", "26px")
  .text(x_label);

const x_scale = d3.scaleLinear().range([margin.left, width - margin.right]);
const y_scale = d3.scaleLinear().range([
  height - margin.bottom - margin.top,
  margin.top,
]);

function setDomain(year_values, generosity_values) {
  x_scale.domain([d3.min(year_values), d3.max(year_values)]).nice(ticks);
  y_scale.domain([d3.min(generosity_values) - .2, d3.max(generosity_values)]).nice(ticks);
}

var negative_generosity_values = [];
function setMinDomain(data) {
  var temp_negative_generosity_values = data.filter((generosity) => {return generosity<0});
  temp_negative_generosity_values.forEach((d)=>{
    negative_generosity_values.push(-1*d);
    return negative_generosity_values;
  })
}

const ticks = 15;

const x_axis = d3.axisBottom()
  .scale(x_scale)
  .tickPadding(10)
  .ticks(ticks)
  .tickSize(-height + margin.top * 2 + margin.bottom);

const y_axis = d3.axisLeft()
  .scale(y_scale)
  .tickPadding(5)
  .ticks(ticks, ".1")
  .tickSize(-width + margin.left + margin.right);

y_axis.tickFormat((d) => {
  return d + "%";
});

const line_generator = d3.line()
  .x((d) => x_scale(d.year))
  .y((d) => y_scale(+d.generosity))
  .curve(d3.curveNatural);

d3.csv("http://localhost:8000/data/world-report.csv").then(function(data) {
    
  var countryNames = [];
    data.forEach((d)=>{
        let temp_country_name = countryNames.find((country) => {return country === d.country_name});
        if (!temp_country_name) countryNames.push(d.country_name);
        return countryNames;
    })

  var generosity_values = [];
    data.forEach((d)=>{
      let temp_generosity_values = generosity_values.find((generosity) => {return generosity === d.generosity});
      if (!temp_generosity_values) generosity_values.push(d.generosity);
      return generosity_values;
    })

  var year_values = [];
  data.forEach((d)=>{
    let temp_year_values = year_values.find((year) => {return year === d.year});
    if (!temp_year_values) year_values.push(d.year);
    return year_values;
  })
  
  setMinDomain(generosity_values);

  x_scale.domain([d3.min(year_values), d3.max(year_values)]).nice(ticks);
  y_scale.domain([-1*(d3.max(negative_generosity_values)), d3.max(generosity_values)]).nice(ticks);
    
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(countryNames)
    .enter()
    .append('option')
    .text(d => d)
    .attr("value", d => d);

    let filter_data = data.filter((d) => {return d.country_name === "Afghanistan"});
  
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
      .call(x_axis);

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(y_axis);

    const path = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 4)
      .attr("d", line_generator(filter_data))

    function update(selectedOption) {

        const dataFilter = data.filter((item) => {return item.country_name === selectedOption});

        path
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", line_generator(dataFilter))        
        label
            .text(`${y_label} of ${selectedOption}`);

    }

    d3.select("#selectButton").on("change", function(event, d) {
        let selectedOption = d3.select(this).property("value")
        update(selectedOption)
    })
});
