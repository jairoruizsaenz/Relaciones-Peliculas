/* global d3 */
document.body.style.zoom = 0.80
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
    margin = {top: 50, right: 20, bottom: 80, left: 20};

    var breaks = ["Pelicula","Director","Actor"];
function update(path){
    svg
        .append("svg")
        .attr("width", width)
        .attr("height", height);

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),        
    r = 4,
    color = d3.scaleOrdinal(d3.schemeCategory20),
    color2 = d3.scaleOrdinal(d3.schemeCategory20),
    widthScale = d3.scaleLinear().range([0,width- margin.left -margin.right]),    
    heightScale = d3.scaleLinear().range([0,height- margin.top -margin.bottom]);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.Nombre; }).distance(3))
    .force("collide", d3.forceCollide(r+3))
    .force("charge", d3.forceManyBody().strength(-20))    

    .force('x', d3.forceX()
       .x(function (d) {                
        if (d.Grupo == "Pelicula") {
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
    
    .force('y', d3.forceY()
       .y(function (d,i) {                
        if (d.Grupo == "Pelicula") {
            return heightScale(i);
        } else {            
            return (height);
        }
    }).strength(function (d) {
                
        if (d.Grupo == "Pelicula") {
            return 2;
        } else {            
            return 0;
        }
    }));


    d3.json(path, function(error, graph) {
      if (error) throw error;

      var num_movies = 0;
      var minYear = Number(d3.min(graph.nodes, function(d) { if (d.Grupo == "Pelicula") { 
          num_movies = num_movies + 1;
          return d.Fecha;          
      }}));
      
      var maxYear = Number(d3.max(graph.nodes, function(d) { if (d.Grupo == "Pelicula") { return d.Fecha; }}))+1;

      num_movies = num_movies + 1;
      widthScale.domain([minYear,maxYear]).nice();
      heightScale.domain([0,num_movies]).nice();

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
        .data(graph.nodes);
        
      var nodeEnter = node.enter()
            .append("circle")      
            .attr("r", function (d) {                
                if (d.Grupo == "Pelicula") {                    
                    return r * 1.5;
                }else if (d.Grupo == "Director") {
                    return r * 1.3;
                } else {            
                    return r;
                }
            });
      node.merge(nodeEnter)
          .attr("stroke","white")  
          .attr("stroke-width",0.5)
          .attr("fill", function(d) { return color(d.Grupo); })
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            .append("title")
            .html(function (d) {         
            if (d.Grupo == "Pelicula") {    
                    return "Película          : " + d.Nombre + "<br>" + 
                    "Lanzamiento : " + d.Fecha + "<br>" + 
                    "Score IMDb   : " + d.Score
                        
                        ;
            } else {            
                return d.Nombre ;
            }});
                  
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

var key = g.append("g")
    .attr("transform", "translate(" + (width*0.35) + "," + (height*0.90) + ")");

key.selectAll("rect")
    .data(breaks)
    .enter()
    .append("rect")
    .attr("width","15px")
    .attr("height","15px")
    .attr("x",function(d,i){return i*150;})
    .attr("fill",function(d){return color2(d);});
        
    key.selectAll("text")
        .data(breaks)
        .enter()
        .append("text")
        .attr("x",function(d,i){return 15+5+(i*150);})
        .attr("y","1em")
        .attr("font-size", 15)
        .text(function(d,i){
          return breaks[i];
        });
        
      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.merge(nodeEnter)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        text
            .attr("transform", function(d) { return "translate(" + (d.x + 10) + "," + d.y + ")"; });
      }

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height*0.85) + ")")  
        .style("font-size", default_text_size)
        .call(d3.axisBottom(widthScale).ticks(null, "0"))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(" + (0) + "," + 45 + ")")
        .attr("font-weight", "bold")
        .text("Año de Lanzamiento")          
        .attr("text-anchor","start");

    var linkedByIndex = {};
        graph.links.forEach(function(d) {
        linkedByIndex[d.source.Nombre + "," + d.target.Nombre] = true;
        });

        function isConnected(a, b) {
            return linkedByIndex[a.Nombre + "," + b.Nombre] || linkedByIndex[b.Nombre + "," + a.Nombre] || a.Nombre == b.Nombre;   
        }   

        node.merge(nodeEnter)
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

        node.merge(nodeEnter)
            .attr("fill-opacity", function(o) {          
            return isConnected(d, o) ? 1 : highlight_trans;})

            .attr("r", function (o) {                
            return isConnected(d, o) ? r * 1.5 : r * 1.3;})

        text
            .style("opacity", function(o) {        
            return isConnected(d, o) ? 1 : default_stroke_opacity;})

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

        node.merge(nodeEnter)
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
            .style("opacity", 1)
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

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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

    function button_click(indice) {
        console.log("button_",indice);
        g.remove();
        update("resources/data/data_" + indice +".json");
    } 
    
d3.select("#button_1").on("click", function() {button_click("01");});
d3.select("#button_2").on("click", function() {button_click("02");});
d3.select("#button_3").on("click", function() {button_click("03");});
d3.select("#button_4").on("click", function() {button_click("04");});
d3.select("#button_5").on("click", function() {button_click("05");});

}
update("resources/data/data_01.json")
