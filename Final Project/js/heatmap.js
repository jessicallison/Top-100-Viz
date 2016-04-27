  var margin = { top: 50, right: 0, bottom: 100, left: 200 },
      width = 750 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom,
      gridSize = (width / 11),
      legendElementWidth = gridSize + 5,
      buckets = 7,
      playing = false,
     
      colors0 = ['#e6e6e6','#cccccc','#b3b3b3','#999999','#808080','#666666','#4d4d4d'],
      
      colors1 = ['#FCCFCF', '#FA9E9E', '#F76E6E', '#F53D3D', '#F20D0D', '#C20A0A'],
      colors2 = ['#FFE0CC', '#FFC299', '#FFA366', '#FF8533', '#FF6600', '#CC5200'],
      colors3 = ['#FFF5CC', '#FFEB99', '#FFE066', '#FFD633', '#FFCC00', '#CCA300'],
      colors8 = ['#CCFFD6', '#99FFAD', '#66FF85', '#33FF5C', '#00FF33', '#00CC29'],
      colors7 = ['#CCFFFA', '#99FFF5', '#66FFF0', '#33FFEB', '#00FFE6', '#00CCB8'],
      colors4 = ['#CCF5FF', '#99EBFF', '#66E0FF', '#33D6FF', '#00CCFF', '#00A3CC'],
      
      colors5 = ['#CCDBFF', '#99B8FF', '#6694FF', '#3370FF', '#004CFF', '#003DCC'],
      colors6 = ['#EBCCFF', '#D699FF', '#C266FF', '#AD33FF', '#9900FF', '#7A00CC'],
      colors9 = ['#FACCFF', '#F599FF', '#F066FF', '#EB33FF', '#E500FF', '#B800CC'],           
      colors10 = ['#FFCCEB', '#FF99D6', '#FF66C2', '#FF33AD', '#FF0099', '#CC007A'],
      
      years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000"];
      genres = ["Alternative", "Country",  "EDM", "HipHop", "Pop", "PopRock", "RnB", "Rock", "Reggae", "Other"];

function fillColor(cluster) {
    if (cluster == 1) {
        return '#F20D0D';
    } else if (cluster == 2) {
         return '#FF6600';
    } else if (cluster == 3) {
         return '#FFCC00';
    } else if (cluster == 4) {
         return '#00CCFF';
    } else if (cluster == 5) {
         return '#004CFF';
    } else if (cluster == 6) {
         return '#9900FF';
    } else if (cluster == 7) {
         return '#00FFE6';
    } else if (cluster == 8) {
         return '#00FF33';
    } else if (cluster == 9) {
         return '#E500FF';
    } else if (cluster == 10) {
         return '#FF0099';
    }
}

      //datasets = ["data.csv", "data2.csv"];

  var svg = d3.select("#heatmap").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      //.attr("transform", "scale("+ 10 +")")

  var genreLabel = svg.selectAll(".genreLabel")
      .data(genres)
      .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "genreLabel mono axis axis-workweek");

  var yearLabel = svg.selectAll(".yearLabel")
      .data(years)
      .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * (gridSize-10); })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class","timeLabel mono axis axis-worktime");
 var clickedArray = [];
    

  function colorScale(e) {
      var colors = [];
      var color = "";
      if(e["genre order"] == 1) {
              colors = colors1;
      } else if (e["genre order"] == 2) {
              colors = colors2;
      } else if (e["genre order"] == 3) {
              colors = colors3;
      } else if (e["genre order"] == 4) {
              colors = colors4;
      } else if (e["genre order"] == 5) {
              colors = colors5;
      } else if (e["genre order"] == 6) {
              colors = colors6;
      } else if (e["genre order"] == 7) {
              colors = colors7;
      } else if (e["genre order"] == 8) {
              colors = colors8;
      } else if (e["genre order"] == 9) {
              colors = colors9;
      } else if (e["genre order"] == 10) {
              colors = colors10;
      }
      if(e.value == 0) {color = colors0[0];}
      if(e.value > 0) {color = colors[0];}
      if(e.value >= 5) {color = colors[1];}
      if(e.value >= 10) {color = colors[2];}
      if(e.value >= 15) {color = colors[3];}
      if(e.value >= 20) {color = colors[4];}
      if(e.value >= 25) {color = colors[5];}

      
      return color;
      }
          
    d3.csv('data/genre.csv', function(error, data) {

      data.forEach(function(d){
        d["year order"] = +d["year order"];
        d["genre order"] = +d["genre order"],
        d.value = +d.value;
      });

        
        var colorScale1 = d3.scale.quantile()
          .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
          .range(colors0);

      var cards = svg.append("g").selectAll(".box")
          .data(data);

      cards.append("title");

      cards.enter().append("rect")
          .attr("id", function(d) { return d.genre + d.year; })
          .attr("x", function(d) { return (d["year order"] - 1) * (gridSize-10); })
          .attr("y", function(d) { return (d["genre order"] -1 ) * gridSize + 3; })
            .attr("rx", "30")
            .attr("ry", "30")
          .attr("class", "bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", function(d) { return fillColor(d["genre order"]); })
          .attr("opacity", 0.8);


      cards.transition().duration(function(d) {return 2000 * Math.random();})
          .style("fill", function(d) { return colorScale(d);})
      .style('stroke', "white")
            .style('stroke-width', 2);

      cards.select("title").text(function(d) { return d.value; });
      
      cards.on("click", function(d) { 
          
          var stringTest = "",
              index = 0,
              selected = false,
              init = false;
          
          stringTest = d.genre+d.year;
          
          if(clickedArray.length == 0){
              init = true;
          } else {
              for(j = 0; j < clickedArray.length; j++){
                  if(d == clickedArray[j]){
                      index = j;
                      selected = true;
                    }
                }
          }
          
          var op =  d3.select("#" +stringTest)
              .attr("opacity");
          
          console.log(playing);
          
          if(!playing) {
          
          if (init | op == 0.9) {
          
          if (!selected){
            clickedArray.push(d);
            d3.select("#" +stringTest)
              .attr("class","highlight")
              .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
              .style("stroke-width", 5)
                .style("opacity", 1);
          } else {
            d3.select("#" +stringTest)
              .attr("class","highlight")
              .style("fill", function(d) { return colorScale(d);})
            .style("stroke", "white")
              .style("stroke-width", 2);
              clickedArray.splice(index, 1);
              removeFilter(d);
          }
        
          if(init) {
            initBubbles();
          }   else if (!selected) {
            addFilter(d);
            
            }
            
              if(static == false) {
                  if (clickedArray.length ==2) {
                      d3.select("#query-button")
                        .style("opacity", 1)
                        .on("click", function(d) {
                          playing = true;
                          console.log(playing);
                            numit = clickedYear.length;
                            checkAnim();
                        });
                      d3.select("#year")
                        .style("opacity", 0);
                      d3.select("#year1")
                        .style("opacity", 0);
                      
                  } else {
                      d3.select("#query-button")
                      // d3.select("#anim")
                      .style("opacity", 1)
                    .style("opacity", 1)
                    .on("click", function(d) {
                          playing = true;
                          console.log(playing);
                       numit = clickedYear.length;
                       checkAnim();
                    });
                      d3.select("#year")
                        .style("opacity", 0);
                      d3.select("#year1")
                        .style("opacity", 0);
                      
                      
                                  
                //console.log(numit);
                //console.log("button");
              }
              }
          
          updateOpacity();

          }
          
          }
        });
        
        

      cards.exit().remove();
        
        function updateOpacity() {
            cards.attr("opacity", function(d) {
            //console.log('j');
            if(clickedArray.length == 0 | d.opacity == 1) {
                return 1;
            } else {
                var not = true;
                for(var i = 0; i < clickedArray.length; i++) {
                    if(d.genre == clickedArray[i].genre) {
                        not = false;
                    } else if (d.year == clickedArray[i].year) {
                        not = false;
                    }
                }
                if (not) {
                    return 0.2;
                } else {
                    return 0.9;
                }
            }
        });
        }


     var legend = svg.selectAll(".legend")
          .data([0].concat(1, 5, 10, 15, 20, 25));
              //colorScale1.quantiles()), function(d) { return d; });

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        //.attr("x", function(d) { return (d["year order"] - 1) * (gridSize-10); })
        .attr("x", function(d, i) { return (gridSize-1) * i + 60; })
        .attr("y", gridSize * 10   + 3*gridSize/4)
        .attr("rx", 30)
        .attr("ry", 30)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d, i) { return colors0[i]; });

      legend.append("text")
        .attr("class", "mono")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return (gridSize-1) * i + 76; })
        .attr("y", gridSize * 12 + 5 );

      legend.exit().remove();

    });  

function removeAnim() {
    playing  = false;
    d3.select("#query-button")
                    .style("opacity", 0);
    d3.select("#year")
                        .style("opacity", 1);
                      d3.select("#year1")
                        .style("opacity", 1);
}

  



function allBubbles() {
    
    var d = {
        year: "1990", 
        genre: "Alternative", 
        value: 2, 
        "year order": 1, 
        "genre order": 1};
    
    clickedArray.push(d);
    d3.select("#Alternative1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    initBubbles();
    d = {year: "1990", genre: "Country", value: 0, "year order": 1, "genre order": 2};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#Country1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "EDM", value: 12, "year order": 1, "genre order": 3};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#EDM1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "HipHop", value: 8, "year order": 1, "genre order": 4};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#HipHop1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "Pop", value: 23, "year order": 1, "genre order": 5};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#Pop1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "PopRock", value: 14, "year order": 1, "genre order": 6};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#PopRock1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "RnB", value: 24, "year order": 1, "genre order": 7};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#RnB1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "Rock", value: 23, "year order": 1, "genre order": 8};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#Rock1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "Reggae", value: 0, "year order": 1, "genre order": 9};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#Reggae1990")
      .attr("class","highlight")
      .style('stroke', function (d) { console.log(d);return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);
    d = {year: "1990", genre: "Other", value: 1, "year order": 1, "genre order": 10};
    //console.log(d);
    clickedArray.push(d);
    d3.select("#Other1990")
      .attr("class","highlight")
      .style('stroke', function (d) { return d3.rgb(colorScale(d)).darker(); })
      .style("stroke-width", 5)
      .style("opacity", 1);
    addFilter(d);   
}

  var resetButton = d3.select("#reset-button")
    //.data(data)
    //.enter()
    .append("p")
    .append("button")
    .text("Reset")
    .on("click", function(d){
      window.location.reload();

  });





