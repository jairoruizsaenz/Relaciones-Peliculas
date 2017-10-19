/* global d3 */
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 50, right: 80, bottom: 50, left: 80};
    
    svg
        .append("svg")
        .attr("width", width)
        .attr("height", height);

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),        
    r = 3,
    color = d3.scaleOrdinal(d3.schemeCategory20),
    widthScale = d3.scaleLinear().range([0,width- margin.left -margin.right]);
    //heightScale = d3.scaleBand().range([0,height]);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.Nombre; }).distance(10))
    .force("collide", d3.forceCollide(r+1))        
    .force("charge", d3.forceManyBody()
           .strength(-80)
           )
    //.force("center", d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX()
       .x(function (d) {                
        if (d.Grupo == "Pelicula") {
            //console.log("d.Grupo :", d.Grupo);
            //console.log("widthScale", widthScale(d.Fecha));
            return widthScale(d.Fecha);
        } else {            
            return (width);
        }
    }).strength(function (d) {
                
        if (d.Grupo == "Pelicula") {
            return 2;
        } else {            
            return 0;
        }
    }))

    .force("y", d3.forceY(
        height/2
    ));

d3.json("resources/data/data2.json", function(error, graph) {
  if (error) throw error;

  //console.log("Max:",d3.max(graph.nodes, function(d) { return d.Fecha; }));
  //console.log("Min:",d3.min(graph.nodes, function(d) { return d.Fecha; }));

  widthScale.domain([2000,2017]).nice();    
  //heightScale.domain(graph.nodes.map(function(d) { return d.Nombre; }));
    
  var link = g.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", 1)
      .attr("stroke","#999")
      .attr("stroke-opacity",0.6)  
    ;

  var node = g.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")      
      .attr("r", function (d) {
                
        if (d.Grupo == "Pelicula") {
            return r * 1.5;
        } else {            
            return r;
        }
    })            
      .attr("stroke","#fff")        
      .attr("fill", function(d) { return color(d.Grupo); })
      .call(d3.drag()
          .subject(dragsubject)
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
    
    node.append("title").text(function (d) { return d.Nombre; });
    
var text = g.selectAll(".text")
    .data(graph.nodes)
    .enter().append("text")
    .attr("dy", ".35em")
    .style("font-size", 15 + "px")
    .text(function(d) { 
    
        if (d.Grupo == "Pelicula") {
            return d.Nombre + " " + d.Fecha;
        } else {            
            return "";
        }        
    });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      
    text
        .attr("transform", function(d) { return "translate(" + (d.x + 5) + "," + d.y + ")"; });
  }

//Creación del eje X
g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height*0.9) + ")")    
    .call(d3.axisBottom(widthScale).ticks(null, "s"))
});

function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  }

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  console.log(d3.event.subject);
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;

}