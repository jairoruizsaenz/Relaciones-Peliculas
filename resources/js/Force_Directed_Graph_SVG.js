/* global d3 */
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 50, right: 50, bottom: 30, left: 50};
    
    svg
        .append("svg")
        .attr("width", width)
        .attr("height", height);

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),        
    r = 4,
    color = d3.scaleOrdinal(d3.schemeCategory20),
    widthScale = d3.scaleLinear().range([0,width- margin.left -margin.right]),
    //heightScale = d3.scaleBand().range([0,height]);
    heightScale = d3.scaleLinear().range([0,height- margin.top -margin.bottom]);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.Nombre; }).distance(2))
    .force("collide", d3.forceCollide(r+3))
    .force("charge", d3.forceManyBody()
           .strength(-20)
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
            //console.log("getXForce :", getXForce(d));
            return 2;
        } else {            
            return 0;
        }
    }))

    //.force("y", d3.forceY(height/2));
    .force('y', d3.forceY()
       .y(function (d,i) {                
        if (d.Grupo == "Pelicula") {
            //console.log("d.Grupo :", d.Grupo);
            //console.log("widthScale", widthScale(d.Fecha));
            return heightScale(i);
        } else {            
            return (height);
        }
    }).strength(function (d) {
                
        if (d.Grupo == "Pelicula") {
            //console.log("getXForce :", getXForce(d));
            return 2;
        } else {            
            return 0;
        }
    }));

d3.json("resources/data/data.json", function(error, graph) {
  if (error) throw error;

  //console.log("Max:",d3.max(graph.nodes, function(d) { return d.Fecha; }));
  //console.log("Min:",d3.min(graph.nodes, function(d) { return d.Fecha; }));

  widthScale.domain([2000,2017]).nice();    
  heightScale.domain([0,30]).nice();
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
        }else if (d.Grupo == "Director") {
            return r * 1.3;
        } else {            
            return r;
        }
    })            
      .attr("stroke","#fff")        
      .attr("fill", function(d) { return color(d.Grupo); })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    node.append("title")        
        .text(function (d) {         
        if (d.Grupo == "Pelicula") {            
            return d.Nombre + " (" + d.Fecha + ")";
        } else {            
            return d.Nombre ;
        }
    
    });
    
var text = g.selectAll(".text")
    .data(graph.nodes)
    .enter().append("text")
    .attr("dy", ".35em")
    //.attr("font-weight","bold")
    .style("font-size", 15 + "px")
    .text(function(d) { 
    
        if (d.Grupo == "Pelicula") {
            return d.Nombre;
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
        .attr("transform", function(d) { return "translate(" + (d.x + 7) + "," + d.y + ")"; });
  }

//Creación del eje X
g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height*0.87) + ")")  
    .style("font-size", 15 + "px")
    .call(d3.axisBottom(widthScale).ticks(null, "0"))
.append("text")
    .attr("class", "axis_label")
    .attr("transform", "translate(" + (0) + "," + 45 + ")")
    .text("Año de Lanzamiento")        
    .attr("text-anchor","start");
        
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  //console.log(d3.event.subject);
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

/*
function getXForce(d){
    var temp = temp + function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? 1 : o.x;
    }
    return temp;
}
*/