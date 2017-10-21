/* global d3 */
var highlight_stroke_width = 3,
    highlight_color = "#fd0000",
    highlight_trans = 0.1,
    highlight_stroke_opacity = 0.7,
    highlight_text_size = "17px",

    default_stroke_width = 1,
    default_stroke_color = "#777777",
    default_stroke_opacity = 0.5,
    default_text_size = "15px",

    svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 50, right: 50, bottom: 50, left: 50};
    
    svg
        .append("svg")
        .attr("width", width)
        .attr("height", height);

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),        
    r = 4,
    color = "rgb(255, 127, 14)";
    
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.Nombre; }))//.distance(100))
    .force("collide", d3.forceCollide(r+3))
    .force("charge", d3.forceManyBody().strength(-50))
    .force('x', d3.forceX().x((width - margin.left - margin.right)/2).strength(1))
    .force('y', d3.forceY().y((height - margin.top - margin.bottom)/2).strength(1));
    

d3.json("resources/data/data2.json", function(error, graph) {
  if (error) throw error;
  
  //console.log("Min:",d3.min(graph.nodes, function(d) { return d.Fecha; }));
  //console.log("Max:",d3.max(graph.nodes, function(d) { return d.Fecha; }));
  
    //heightScale.domain(graph.nodes.map(function(d) { return d.Nombre; }));
  /*
    widthScale.domain([
          d3.min(graph.nodes, function(d) { return d.N_Peliculas; }),
          d3.max(graph.nodes, function(d) { return d.N_Peliculas; })
      ]).nice();
  
  widthScale.domain([0,12]).nice();
  heightScale.domain([170,0]).nice();
*/
  var link = g.append("g")
        .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
        .attr("stroke-width", default_stroke_width)
        .attr("stroke",default_stroke_color)
        .attr("stroke-opacity",default_stroke_opacity);
    
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
      .attr("stroke","white")  
      .attr("stroke-width",0.5)
      .attr("fill", color)
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
        .style("font-size", default_text_size)
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
        .attr("transform", function(d) { return "translate(" + (d.x + 10) + "," + d.y + ")"; });
  }

//::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::
    
var linkedByIndex = {};
    graph.links.forEach(function(d) {
	linkedByIndex[d.source.Nombre + "," + d.target.Nombre] = true;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.Nombre + "," + b.Nombre] || linkedByIndex[b.Nombre + "," + a.Nombre] || a.Nombre == b.Nombre;   
    }   

    node
        .on("mouseover", function(d) { set_highlight(d); })
        .on("mouseout", function() { exit_highlight(); });

function set_highlight(d)
{
    svg.style("cursor","pointer");
    
    text
        .style("font-weight", function(o) {
        return isConnected(d, o) ? "bold" : "normal";})

    link
        .attr("stroke-width", function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_width : default_stroke_width;})

        .style("stroke", function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_color : default_stroke_color;})

        .attr("stroke-opacity", function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_opacity : default_stroke_opacity;});             
}

function set_highlight2(d)
{    
    svg.style("cursor","pointer");
    
    node
        .attr("fill-opacity", function(o) {          
        return isConnected(d, o) ? 1 : highlight_trans;})
    
        .attr("r", function (o) {                
        return isConnected(d, o) ? r * 1.7 : r * 1.3;})
        
    text
        .style("font-weight", function(o) {        
        return isConnected(d, o) ? "bold" : "normal";})
        
        .style("font-size", function(o) {        
        return isConnected(d, o) ? highlight_text_size : default_text_size;})
    
        .text(function(o) {
            if (o.Grupo == "Pelicula") {
                return o.Nombre;
            }else if (o.Nombre == d.Nombre){
                return o.Nombre;
            } else {            
                return "";
            }});    
    
    link
        .attr("stroke-width", function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_width : default_stroke_width;})

        .style("stroke", function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_color : default_stroke_color;})

        .attr("stroke-opacity", function(o) {
        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_opacity : highlight_trans;}); 
}
    
function exit_highlight()
{
    svg.style("cursor","default");

    node
        .attr("fill-opacity", 1)
        .attr("r", function (d) {                
            if (d.Grupo == "Pelicula") {
                return r * 1.5;
            }else if (d.Grupo == "Director") {
                return r * 1.3;
            } else {            
                return r;
            }
        })
    
    text
        .style("font-weight", "normal")
        .style("font-size", default_text_size)
        .text(function(d) {
            if (d.Grupo == "Pelicula") {
                return d.Nombre;
            } else {            
                return "";
            }});    
    link                
        .attr("stroke-width", default_stroke_width)
        .style("stroke", default_stroke_color)
        .attr("stroke-opacity",default_stroke_opacity);   
}
    
//::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.0).restart();
  d.fx = d.x;
  d.fy = d.y;  
    
  set_highlight2(d);
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
    
  set_highlight2(d);
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);    
  d.fx = null;
  d.fy = null;

  exit_highlight();
  set_highlight(d);
}
});
    
d3.select("#button_1").on("click", function() {console.log("button_1");});
d3.select("#button_2").on("click", function() {console.log("button_2");});
d3.select("#button_3").on("click", function() {console.log("button_3");});
d3.select("#button_4").on("click", function() {console.log("button_4");});
d3.select("#button_5").on("click", function() {console.log("button_5");});
