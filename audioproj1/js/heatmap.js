  var margin = { top: 50, right: 0, bottom: 100, left: 100 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      gridSize = (width / 22),
      legendElementWidth = gridSize + 5,
      buckets = 9,
     
      colors = ['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#810f7c','#4d004b'],
    

      years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000"];
      genres = ["Alternative", "Country",  "Christian", "EDM", "Hip hop", "Pop", "Pop rock", "R&B", "Reggae", "Rock"];

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
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        //.style("opacity", 0)
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
 var clickedArray = [];
    
    d3.csv('data/genre.csv', function(error, data) {

      data.forEach(function(d){
        d["year order"] = +d["year order"];
        d["genre order"] = +d["genre order"],
        d.value = +d.value;
      });

      var colorScale = d3.scale.quantile()
          .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
          .range(colors);

      var cards = svg.append("g").selectAll(".box")
          .data(data);

      cards.append("title");

      cards.enter().append("rect")
          .attr("id", function(d) { return d.genre + d.year; })
          //.attr("id", function(d) { return d.genre + d.year; })
          //.attr("type", "button")
          .attr("x", function(d) { return (d["year order"] - 1) * gridSize; })
          .attr("y", function(d) { return (d["genre order"] - 1) * gridSize; })
          //.attr("x", function(d) { return d.genre; })
          //.attr("y", function(d) { return d.year; })
          // .attr("rx", 20)
          // .attr("ry", 5)
          .attr("class", "bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          //.attr("selected", "0")
          .style("fill", colors[7]);


      cards.transition().duration(function(d) {return 2000 * Math.random();})
          .style("fill", function(d) { return colorScale(d.value); });

      cards.select("title").text(function(d) { return d.value; });
      
      cards.on("click", click); 

        var stringTest = ""; 
        var i = 0; 
       
//        var clickedGenre = [];
//        var clickedYear = [];
        var selected = "false";
        var sameGenre = "true";

        function click(element) {

          for(j = 0; j < clickedArray.length; j++){
            if(element == clickedArray[j]){
              selected = "true";
              break;
            } else {
              selected = "false";
            }
          }

          for(a = 0; a < clickedArray.length; a++){

            if(clickedArray.length == 0){
              sameGenre = "true";
              break;
            }
            // if(element.year == clickedArray[a].year){
            //   sameGenre = "true";
            //   break;
            // } 
            if((element.genre == clickedArray[a].genre) && (element.year != clickedArray[a].year)){
              sameGenre = "true";
              break;
            } else {
              sameGenre = "false";
            }
            if((element.year == clickedArray[a].year) && (element.genre != clickedArray[a].genre)) {
              sameGenre = "true"; 
              break; 
            } else {
              sameGenre = "false";
            }
          }

          //console.log(selected);
          if (selected == "false" && sameGenre == "true"){
            //element.selected = "true";
            console.log(element);
            i++; 
            //console.log("i"+i);
            clickedArray.push(element);
            //clickedGenre.push(element.genre);
            //clickedYear.push(element.year);
            stringTest = clickedArray[i-1].genre + clickedArray[i-1].year; 
            console.log("stringTest: " + stringTest);

            d3.select("#" +stringTest)
              .attr("class","highlight")
              .style("fill", "#fde0dd");
          } else {
            console.log("element already selected yo!")
          }

          console.log("the array contains: ");
          for(o = 0; o < clickedArray.length ; o++){
            //console.log(clickedYear[o] + clickedGenre[o] + ", ");
          }

        }

      cards.exit().remove();


      var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) { return d; });

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", gridSize * 10 + gridSize/2)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) { return colors[i]; });

      legend.append("text")
        .attr("class", "mono")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", gridSize * 11 + 15 );

      legend.exit().remove();

    });  



  var queryButton = d3.select("#query-button")
      .append("p")
      .append("button")
      .text("Run Query");

  var resetButton = d3.select("#reset-button")
    //.data(data)
    //.enter()
    .append("p")
    .append("button")
    .text("Reset")
    .on("click", function(d){
      window.location.reload();

  });




