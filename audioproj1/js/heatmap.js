  var margin = { top: 50, right: 0, bottom: 100, left: 100 },
      width = 1060 - margin.left - margin.right,
      height = 1300 - margin.top - margin.bottom,
      gridSize = (width / 16),
      legendElementWidth = gridSize + 5,
      buckets = 8,
     
      colors0 = ['#e6e6e6','#cccccc','#b3b3b3','#999999','#808080','#666666','#4d4d4d','#333333','#1a1a1a'],
      
      colors1 = ['#d9e6f2','#b3cce6','#8cb3d9','#6699cc','#4080bf','#336699','#264d73','#19334d','#0d1a26'],
      colors2 = ['#f2d9f2','#e6b3e6','#d98cd9','#cc66cc','#bf40bf','#993399','#732673','#4d194d','#260d26'],
      colors3 = ['#f2d9e6','#e6b3cc','#d98cb3','#cc6699','#bf4080','#993366','#73264d','#4d1933','#260d1a'],
      colors4 = ['#d9f2f2','#b3e6e6','#8cd9d9','#66cccc','#40bfbf','#339999','#267373','#194d4d','#0d2626'],
      colors5 = ['#f2d9d9','#e6b3b3','#d98c8c','#cc6666','#bf4040','#993333','#732626','#4d1919','#260d0d'],
      colors6 = ['#f2f2d9','#e6e6b3','#d9d98c','#cccc66','#bfbf40','#999933','#737326','#4d4d19','#26260d'],
      colors7 = ['#d9d9f2','#b3b3e6','#8c8cd9','#6666cc','#4040bf','#333399','#262673','#19194d','#0d0d26'],
      colors8 = ['#e6d9f2','#ccb3e6','#b38cd9','#9966cc','#8040bf','#663399','#4d2673','#33194d','#1a0d26'],
      
      
      
      
      colors10 = ['#d9e6f2','#b3cce6','#8cb3d9','#6699cc','#4080bf','#336699','#264d73','#19334d','#0d1a26'],
      
      colors9 = ['#d9f2e6','#b3e6cc','#8cd9b3','#66cc99','#40bf80','#339966','#26734d','#194d33','#0d261a'],
      
      
    

      years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000"];
      genres = ["Alternative", "Country",  "EDM", "HipHop", "Pop", "PopRock", "RnB", "Rock", "Blues", "Reggae", "Christian", "Jazz", "Folk"];

var fillColor = d3.scale.ordinal()
    .domain(genres)
    .range(['#4080bf', '#4040bf', '#8040bf', '#bf40bf', '#bf4080', '#9cbdde', '#40bfbf', '#40bf80', '#bf4040', '#bfbf40','#000000', '#000000', '#000000']);

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
        .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
 var clickedArray = [];
    
    d3.csv('data/genre.csv', function(error, data) {

      data.forEach(function(d){
        d["year order"] = +d["year order"];
        d["genre order"] = +d["genre order"],
        d.value = +d.value;
      });

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
          if(e.value >= 0) {color = colors[0];}
          if(e.value >= 2) {color = colors[1];}
          if(e.value >= 4) {color = colors[2];}
          if(e.value >= 7) {color = colors[3];}
          if(e.value >= 11) {color = colors[4];}
          if(e.value >= 18) {color = colors[5];}
          if(e.value >= 25) {color = colors[6];}
          if(e.value >= 31) {color = colors[7];}
          
          return color;
          }
        
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
          
          updateOpacity();

          }
          
        });
        
        

      cards.exit().remove();
        
        function updateOpacity() {
            cards.attr("opacity", function(d) {
            console.log('j');
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
          .data([0].concat(colorScale1.quantiles()), function(d) { return d; });

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        //.attr("x", function(d) { return (d["year order"] - 1) * (gridSize-10); })
        .attr("x", function(d, i) { return (gridSize-10) * i; })
        .attr("y", gridSize * 13 + 3*gridSize/4)
        .attr("rx", 30)
        .attr("ry", 30)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d, i) { return colors0[i]; });

      legend.append("text")
        .attr("class", "mono")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return (gridSize-8) * i + 5; })
        .attr("y", gridSize * 15 + 5 );

      legend.exit().remove();

    });  



  var queryButton = d3.select("#query-button")
      .append("p")
      .append("button")
      .text("Run Query")
        .on("click", function(d) {
            onClick();});

  var resetButton = d3.select("#reset-button")
    //.data(data)
    //.enter()
    .append("p")
    .append("button")
    .text("Reset")
    .on("click", function(d){
      window.location.reload();

  });




