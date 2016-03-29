/* Setting document and chart properties */
var margin = {top: 20, right: 20, bottom: 120, left: 40},
    width = 260 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
      
/* Setting the range and axis */
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
var y = d3.scale.linear().range([height, 0]);
var xAxis2 = d3.svg.axis().scale(x).orient("bottom");
var yAxis2 = d3.svg.axis().scale(y).orient("left").ticks(20);


      
/* Creating an SVG canvas */
var svg2 = d3.select(".barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      
/* Load data from file with a specific type function */
d3.csv("cereal.csv", function(error, data) {
    
    data.forEach(function(d) {
        d.Man = d.Manufacturer;
        d.Cals = +d.Calories; });
    
    nestedData = d3.nest()
        .key(function(a) { return a.Man})
        .rollup(function(b) {
            return { "avgCal" : d3.mean(b, function(d) {return(d.Cals)})
          }
        })
        .entries(data);

    
    x.domain(data.map(function(d) { return d.Man; }));
    y.domain([0, d3.max(data, function(d) { return d.Cals; })]);
    
    
    if (error) throw error;
    
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "white")
        .call(xAxis2)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg2.append("g")
        .attr("class", "y axis")
        .attr("fill", "white")
        .call(yAxis2)
        .append("text")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Avg Calories");
    
 var svg4 = d3.select(".scatterplot");
    
    svg2.selectAll("bar")
        .data(nestedData)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(e) { return x(e.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(f) { return f.values.avgCal; })
        .attr("height", function(d) { return height - d.values.avgCal; })
        .on("mouseover", function(d) {

           

            svg4.selectAll("circle").transition()
                .duration(500)
                .style("opacity", function(e) {
                    if (d.key != e["Manufacturer"]) {
                        return "0.25";
                    } else {
                        return "1";
                    }
                } );

      })
      .on("mouseout", function(d) {
            svg4.selectAll("circle").transition()
            .duration(500)
            .style("opacity", "1");
            

      });
        
});
      

