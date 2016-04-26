var width = 660,
    height = 600;

var static = true;
var numit = 0;
var clickedYear = [];

(function() {
        
    var svg1 = d3.select('#vis')
        .append('svg')
        .attr('id', "svg1")
        .attr('width', width)
        .attr('height', height);
    
})();


var svg1 = d3.select('#svg1');
    
var dataname = 'data/money.csv';
var padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12,
    damper = 0.00,
    //static = true,
    bubbles = null,
    nodes = [],
    clusters = new Array(5),
    clickedGenre = [];
  
var tooltip = floatingTooltip('gates_tooltip', 240);
var center = { x: width / 2, y: height / 2 };

var force = d3.layout.force()
    .size([width, height])
    .charge(0)
    .gravity(0.02);

function fillColor1(cluster) {
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
    
var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([0.1, 20]);

radiusScale.domain([0, 100]);

var genre = "";
var it = 0;

var year;

function gen(clickedGenre) {
    var genre = "";
    clickedGenre.forEach(function(d) {
        genre = genre + d + ", ";
    });
    return genre;  
};

function initBubbles() {
    
    clickedYear[0] = clickedArray[0].year;
    clickedGenre[0] = clickedArray[0].genre;

    genre = gen(clickedGenre);
    
    numit = clickedYear.length;
    year = clickedYear[it];
    
    document.getElementById("yeardisplay").innerHTML = year;
    document.getElementById("genredisplay").innerHTML = gen(clickedGenre);
    
    d3.csv('data/money.csv', function(error, data1) {
        data = data1;
        buildNodes(data, clickedGenre); 
        force.nodes(nodes);
        buildBubbles();  
    });
}

function buildBubbles() {
    bubbles = svg1.selectAll('.bubble')
            .data(nodes, function (d) { return d.num; });
    
        bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('id', function(d) { return "a"+d.num; })
            .attr('r', 0)
            .attr('fill', function (d) { return fillColor1(d.cluster); })
            .attr('fill-opacity', function (d) { return d.value / 100; })
            .attr('stroke', function (d) { return d3.rgb(fillColor1(d.cluster)).darker(); })
            .attr('stroke-width', 2)
            .call(force.drag)
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        bubbles.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.num; });

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) { return d.radius; });

        groupBubbles();
    
}

function addFilter(element) {
    var diff = true;
    clickedGenre.forEach(function (d) {
        if (element.genre == d) {
            //console.log("new yaer");
            static = false;
            numit = clickedYear.length;
            clickedYear[numit]=element.year;
            
            diff = false;  
        }
    });
    if(diff) {
       if(element.year == year) {
           clickedGenre[clickedGenre.length]=element.genre;
           buildNodes(data, [element.genre]);
           buildBubbles();
        }
    }
    document.getElementById("genredisplay").innerHTML = gen(clickedGenre);
}

function removeFilter(element) {
    var k = 0;
    var max = nodes.length;
    for (var i =0; i < max; i++) {
        if (nodes[k].genre == element.genre) {
            var res = String(i);
            d3.select("#a"+i).remove();
            nodes.splice(k, 1);
        } else {
            k++;
        }
    }
    
    for(var i = 0; i < clickedGenre.length; i++) {
        if(clickedGenre[i] == element.genre) {
            clickedGenre.splice(i, 1);
            break;
        }
    }
    document.getElementById("genredisplay").innerHTML = gen(clickedGenre);
    
    renumberBubbles(); 
}

function renumberBubbles() {
    bubbles = svg1.selectAll('.bubble') .data(nodes, function (d) { return d.num; });
    var i = 0;
    nodes.forEach(function(d) {
        d.num = i;
        i++;
    });
    bubbles.classed('bubble', true)
        .attr('id', function(d) { return "a"+d.num; });
}
    
   

function checkAnim() {
    d3.select("#query-button")
                    .text("Playing");
   // console.log("check");
    numit = clickedYear.length;
    //console.log(numit)
   // console.log(it);
if(it < (numit-1)) {
    //console.log("once");
    
   setTimeout(function () { 
       it++;
        year = clickedYear[it];
       document.getElementById("yeardisplay").innerHTML = year;
        colorBubbles(); 
   }, 8000);
}
    //console.log(it);
if(it+1 < (numit-1)) {
    //console.log("twice");

   setTimeout(function () { 
            it++;
        year = clickedYear[it];
       document.getElementById("yeardisplay").innerHTML = year;
        colorBubbles(); 
   }, 20000);
}
if(it+2 < (numit-1)) {
    //console.log("thrice");

   setTimeout(function () { 
           it++;
        year = clickedYear[it];
       document.getElementById("yeardisplay").innerHTML = year;
        colorBubbles(); 
   }, 40000);
}
if(it+3 < (numit-1)) {
   // console.log("fourth");
   setTimeout(function () { 
        it++;
        year = clickedYear[it];
        colorBubbles(); 
   }, 60000);
}
    setTimeout(function () { 
        static = true;
    removeAnim();
    //console.log("remove");
   }, (numit)*10000);
    
}
   





//document.getElementById("yeardisplay").innerHTML = year;
//document.getElementById("genredisplay").innerHTML = genre;

function buildNodes (data, clickedGenre) {
    //var i = nodes.length;
    data.forEach(function(d) {
        if(d.year == year) {
        if(filter(d, clickedGenre)) {
            var e = {
                id : d.id,
                radius : radiusScale(+d.hotness),
                value : d.hotness,
                name : d.track_title,
                artist : d.artist,
                year : d.year,
                genre : d.genre,
                cluster: d.genreid,
                num : 0,
                x: Math.cos(d.id / 10 * 2 * Math.PI) * 900 + width / 2 + Math.random(),
                y: Math.sin(d.id / 10 * 2 * Math.PI) * 900 + height / 2 + Math.random(),
                next : false,
                prev : false
            };
            data.forEach(function(h) {
                if(h.year == (year+1) && h.track_title == e.name) {
                    e.next = true;
                }
            });
            
            if (!clusters[d.genreid] || 
                (e.radius > clusters[d.genreid].radius)) clusters[d.genreid] = e;
            nodes.push(e);
        }
        }
    });
    var i = 0;
    nodes.forEach(function(d) {
        d.num = i;
        i++;
    });
}

function filter(d, clickedGenre) {
    
    for (var i = 0; i < clickedGenre.length; i++) {
        if(clickedGenre[i] == "Other") {
            console.log("other");
            //console.log(d.genre);
            if(d.genre == "Christian" | d.genre == "Folk" | d.genre == "Blues" | d.genre == "Jazz") {
                console.log("true");
                return true;
            }
        }
        if (d.genre == clickedGenre[i]) {
            return true;
        }
    }
    return false;
}

var data;

function updateNodes (data) {
    
    var nodesNew = [];
    clusters  = new Array(5);
    data.forEach(function(d) {
        if(d.year == year) {
            if(filter(d, clickedGenre)){
        //if(d.year == year && d.genre == genre) {
            var e = {
                id : d.id,
                radius : radiusScale(+d.hotness),
                value : d.hotness,
                name : d.track_title,
                artist : d.artist,
                year : d.year,
                genre : d.genre,
                cluster: d.genreid,
                num : 0,
                x: Math.cos(d.id / 10 * 2 * Math.PI) * 900 + width / 2 + Math.random(),
                y: Math.sin(d.id / 10 * 2 * Math.PI) * 900 + height / 2 + Math.random(),
                next : false,
                prev : false
            };
            data.forEach(function(h) {
                if(h.year == (year+1) && h.name == e.name) {
                    e.next = true;
                }
                if(h.year == (year-1) && h.name == e.name) {
                    e.prev = true;
                }
            });
            nodesNew.push(e);
        }
        }
    });
    
    //check if song carries over, if so replace
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodesNew.length; j++) {
            if(nodes[i].name == nodesNew[j].name) {
                nodesNew[j].x = nodes[i].x;
                nodesNew[j].y = nodes[i].y;
                nodes[i] = nodesNew[j];
                nodesNew.splice(j, 1);
            }
        }
    }
    
    //if not replaced, replace with new songs
    var j = 0;
    while (j < nodesNew.length) {
        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].year != year) {
                nodesNew[j].x = nodes[i].x;
                nodesNew[j].y = nodes[i].y;
                nodes[i] = nodesNew[j];
                j++;
            }
            if (j >= nodesNew.length) {
                break;
            }
           
        }
        break;
    }

    //if additional nodes, add them
    if(nodesNew.length > nodes.length) {
        for (var i = nodes.length; i < nodesNew.length; i++) {
            nodes.push(nodesNew[i]);
        }
    }
    
    //key nodes
    var i = 0;
    nodes.forEach(function(d) {
        d.num = i;
        i++;
        
    });

    //calculate largest song per cluster
    nodes.forEach(function(d) {
        if (!clusters[d.cluster] || (d.radius > clusters[d.cluster].radius)) clusters[d.cluster] = d;
       
    });
    
    //update the bubble data
    changeBubbles();
    
}

function changeBubbles() {
    document.getElementById("yeardisplay").innerHTML = year;
    document.getElementById("genredisplay").innerHTML = gen(clickedGenre);
    
    bubbles = svg1.selectAll('.bubble')
        .data(nodes, function (d) { return d.num; });
    
    var k = 0;
    var max = nodes.length;
    for (var i =0; i < max; i++) {
        if (nodes[k].year != year) {
            var res = String(i);
            d3.select("#a"+i).remove();
            nodes.splice(k, 1);
        } else {
            k++;
        }
    }
    
    bubbles.enter().append('circle')
    .classed('bubble', true)
     .attr('id', function(d) { return "a"+d.num; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);
    
    bubbles.transition().duration(2000)
    .attr('r', function(d) { return d.radius; })
        .attr('stroke', function (d) { 
            if (d.year == year) {
                return d3.rgb(fillColor1(d.cluster)).darker(); 
            } else {
                return 'white';
            }})
        .attr('fill', function (d) { 
            if (d.year == year) {
                return fillColor1(d.cluster); 
            } else {
                return 'white';
            }})
        .attr('fill-opacity', function (d) { return d.value / 100; })
        .transition().duration(1000)
        .attr('stroke-width', 2);

    setTimeout(function () { 
        groupBubbles1(); 
}, 2000); 
}
                   


setupButtons();

function colorBubbles(){
    
    setTimeout(function () { updateNodes(data); }, 3000);
    bubbles.transition()
        .duration(2000)
        .attr('fill', function(d) {
            if (d.next) { return fillColor1(d.cluster); }
            else { return 'white'; } })
        .attr('stroke', function(d) {
            if (d.next) { return d3.rgb(fillColor1(d.cluster)).darker(); }
            else { return 'gray'; } })
        .attr('stroke-width', function(d) {
            if (d.next) { return 8 }
            else { return 2; } });  
}

    
function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
}      

function groupBubbles() {
    force.on('tick', function (e) {
        bubbles.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.1))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
    });
    force.start();
}

function groupBubbles1() {
    force.on('tick', function (e) {
        bubbles.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.1))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
        ;
    });
    force.start();
}
    
function cluster(alpha) {
    return function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
    };
}
    
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function showDetail(d) {
    d3.select(this).attr('stroke', 'black');
    var content = '<span class="name">Track: </span><span class="value">' +
        d.name + '</span><br/>' +
        '<span class="name">Artist: </span><span class="value">' +
        d.artist + '</span><br/>' +
        '<span class="name">Rank: </span><span class="value">' +
        d.id + '</span><br/>' +
        '<span class="name">Year: </span><span class="value">' +
        d.year + '</span><br/>' +
        '<span class="name">Cluster: </span><span class="value">' +
        d.cluster + '</span><br/>' +
        '<span class="name">Genre: </span><span class="value">' +
        d.genre + '</span>';
    tooltip.showTooltip(content, d3.event);
}

function hideDetail(d) {
    d3.select(this)
        .attr('stroke', d3.rgb(fillColor1(d.cluster)).darker());
    tooltip.hideTooltip();
}

svg1.toggleDisplay = function (displayName) {
    if (!static) {
        year++;
        colorBubbles();
    } else {
        year--;
        colorBubbles();
    }
  };

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      var button = d3.select(this);
      var buttonId = button.attr('id');
      if (buttonId == 'year') {
          button.text("Playing");
          playing = true;
          setTimeout(function () { 
            year++;
              //clickedYear[clickedYear.length]=year;
            colorBubbles(); 
            button.text("Next Year");
            }, 8000);
      } else if (buttonId == 'year1') {
          button.text("Playing");
          playing = true;
          setTimeout(function () { 
            year--;
            colorBubbles(); 
            button.text("Previous Year");
            }, 8000); 
      }
    });
}

function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

    









