function drawBars(data) {

  /**
   * TODO:
   * Play with the D3 filter method and understand how it works.
   *
   **/
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });
}

function drawXAxis(){
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
}

function drawYAxis() {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
}

/**
 * TODO:
 * See? This is easy. Create a preprocessing filter method to remove data for
 * the letter B from the data set
 *
 **/

/**
 * TODO:
 * Supporting the onclick event, write a function that can filter data
 * using the already bound DOM elements, and change the bar's height back
 * to zero.
 *
 * Ready for more? Let's add transitions then!
 *
 **/