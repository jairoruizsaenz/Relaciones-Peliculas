/* global d3 */
var canvas = d3.select("#network"),
  width = canvas.attr("width"),
  height = canvas.attr("height"),
  ctx = canvas.node().getContext("2d"),
  r = 3,
  color = d3.scaleOrdinal(d3.schemeCategory20),
  widthScale = d3.scaleLinear().range([0,width]),
        
  simulation = d3.forceSimulation()
    //.force("x", d3.forceX(width/2))
    
    .force('x', d3.forceX().x(function (d) {
                
        if (d.Grupo == "Pelicula") {
            //console.log("d.Grupo :", d.Grupo);
            //console.log("widthScale", widthScale(d.Fecha));
            return widthScale(d.Fecha);
        } else {            
            return (width / 2);
        }
    }))



    .force("y", d3.forceY(height/2))
    .force("collide", d3.forceCollide(r+1))
    .force("charge", d3.forceManyBody().strength(function (d) {
        
        if (d.Grupo == "Pelicula") {
            //console.log("d.Grupo :", d.Grupo);
            //console.log("widthScale", widthScale(d.Fecha));
            return -100;
        } else {            
            return 0;
        }
    
    }))
    .force("link", d3.forceLink().id(function (d) { return d.Nombre; }));

d3.json("resources/data/data2.json", function (err, graph) {
  if (err) throw err;

    //widthScale.domain([0, d3.max(graph, function(d) { return (d.Fecha); })]);    
    //console.log(widthScale(2015));
    
    widthScale.domain([2000,2020]);
    
    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    
    simulation.on("tick", update);

    canvas
      .call(d3.drag()
          .container(canvas.node())
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    function update() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#9886ff";  
    ctx.lineWidth=1;
    graph.links.forEach(drawLink);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    graph.nodes.forEach(drawNode);
  }

  function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  }

}
       

        
);

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
  console.log(d3.event.subject);
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawNode(d) {
  ctx.beginPath();
  ctx.fillStyle = color(d.Grupo);
  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, Math.PI*2);
  ctx.fill();
}

function drawLink(l) {
  ctx.moveTo(l.source.x, l.source.y);
  ctx.lineTo(l.target.x, l.target.y);
}