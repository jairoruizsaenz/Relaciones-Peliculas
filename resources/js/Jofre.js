/* global d3 */
var svg = d3.select("#svg"),
    width2 = +svg.attr("width"),
    height2 = +svg.attr("height");

var color2 = d3.scaleOrdinal(d3.schemeCategory20);

var simulation2 = d3.forceSimulation()
    //.force("link", d3.forceLink().id(function (d) { return d.Nombre; }).strength(-0.001))
    .force("link", d3.forceLink().id(function (d) { return d.Nombre; }))
    .force("collide", d3.forceCollide(3+1))
    .force("charge", d3.forceManyBody().strength(-50))
    // .force("charge", d3.forceManyBody())
    // .force("center", d3.forceCenter(width / 2, height / 2));
    .force('x', d3.forceX().x(function (d) {

        console.log("forceX", d);

        if (d.Grupo == "Pelicula") {
            console.log("d.group", d.Grupo, "pelicula");
            return width2 / 2;
        } else {
            console.log("d.group", d.Grupo, "NO pelicula");
            return width2 / 2;
        }
        return xScale(d.count);
        // return width / 2;
    }))
    .force('y', d3.forceY().y(function (d) {
        // if (d.group == "Departamento") {
        //     console.log("d.group", d.group," depto");
        //     return height / 10;
        // } else {
        //     console.log("d.group", d.group,"NO depto");
        //     return 9 * height / 10;
        // }
        return height2 / 2;
    }));


var colorLink = d3.scaleOrdinal(d3.schemeCategory20);

d3.json("resources/data/data2.json", function (error, graph) {
    //d3.json("assets/data/miserables.json", function (error, graph) {
    if (error) throw error;

    console.log("graph", graph);
    console.log("graph.links", graph.links);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { /*console.log("+d.Alta",+d.value);*/ return ((+d.count * 1)); })
        //        .style("stroke", function (d) { return colorLink(d.value); });
        .style("stroke", function (d) { return colorLink(1); });

    console.log("termino link");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 3)
        //.enter().append("text")
        //.text(function(d){return d.id})
        // .attr("r", function (d) { return d.group; })
        .attr("fill", function (d) { /*console.log("node",d);*/ return color2(d.Grupo); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    console.log("termino nodes");
    console.log("node", node);

    node.append("title")
        .text(function (d) { return d.Nombre; });

    console.log("termino titles");

    simulation2
        .nodes(graph.nodes)
        .on("tick", ticked);

    console.log("termino simulacion nodes");


    simulation2.force("link")
        .links(graph.links);


    function ticked() {
        /*console.log("ticked");*/
        link
            .attr("x1", function (d) { /*console.log("y1",d);*/ return d.source.x; })
            .attr("y1", function (d) { /*console.log("x1",d);*/ return d.source.y; })
            .attr("x2", function (d) { /*console.log("x2",d);*/ return d.target.x; })
            .attr("y2", function (d) { /*console.log("y2",d);*/ return d.target.y; });

        node
            .attr("cx", function (d) { /*console.log("cx",d);*/ return d.x; })
            .attr("cy", function (d) { /*console.log("cy",d);*/ return d.y; });
    }
});

function dragstarted(d) {
    if (!d3.event.active) simulation2.alphaTarget(0.1).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation2.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}