//Declaración de las variables espaciales del svg
var width3 = WIDTH,
    height3 = HEIGHT,
    margin3 = {top: 60, right: 80, bottom: 50, left: 80},
    svg3 = d3.select("#d3_03_grafico")
            .append("svg")
            .attr("width", width3)
            .attr("height", height3),    
    g3 = svg3.append("g").attr("transform", "translate(" + margin3.left + "," + margin3.top + ")"),
    widthScale3 = d3.scaleLinear().range([0,width3 - margin3.left -margin3.right]),
    heightScale3 = d3.scaleLinear().range([ height3 -margin3.top - margin3.bottom,0]),
    colorScale3 = d3.scaleOrdinal(d3.schemeCategory20)
    r = 5;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Carga del archivo de datos
d3.csv("resources/data/resumen_03.csv", function(d, i, columns) {
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    return d;
},

function(error, data){
    if (error) throw error;

    //Imprime los datos en la consola
    console.log("resources/data/resumen_03.csv");
    console.log(data);

    //Se define la variable keys que corresponde a los valores numéricos
    var keys = data.columns.slice(2);
    
       //Se define el dominio del eje X y Y
    widthScale3.domain([0, d3.max(data, function(d) { return d.Incautaciones; })]).nice();
    heightScale3.domain([0, d3.max(data, function(d) { return d.Cantidad; })]).nice();

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //Creación del tooltip y funciones requeridas
    var tooltip3 = d3.select("body").append("div").attr("class", "toolTip");
    var tipMouseover3 = function(d){
        tooltip3
            .style("left", d3.event.pageX + 50 + "px")
            .style("top", d3.event.pageY - 50 +  "px")
            .style("display", "inline-block")
            .html("<strong>Departamento:</strong> " + d.Departamento +"<br>" +
                    "<strong>Número de Incautaciones:</strong> " + d3.format(",d")(d.Incautaciones) +"<br>" +                    
                    "<strong>Cantidad Incautada:</strong> " + d3.format(",d")(d.Cantidad/1000) + "Kg");
    };
        
    var tipMouseout3 = function(d) {
        tooltip3.style("display", "none"); // don't care about position!
    };

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    var ps = g3.selectAll("circle")
        .data(data);

    // Actions just for new items
    var psEnter =  ps.enter()
        .append("circle")
    .attr("class", "elemento")
        .attr("r", r)
        .attr("cx",0)
        .attr("cy",heightScale3(d3.min(data, function(d) { return d.Cantidad; })));

    // Actions for new + updated
    ps.merge(psEnter)
        //.transition().duration(1000)
        .attr("cy", function (d) {return heightScale3(d.Cantidad); })
        .style("fill", function (d,i) { return colorScale3(i); })
        //.transition().duration(2000)
        .attr("cx", function (d) { return widthScale3(d.Incautaciones); })
        .on("mousemove", tipMouseover3)
        .on("mouseout", tipMouseout3);

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //Creación del eje X y su etiqueta 
    g3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height3 - margin3.top - margin3.bottom )+ ")")    
        .call(d3.axisBottom(widthScale3).ticks(null, "s"))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(" + (width3 - margin3.left - margin3.right) + ",45)")            
        .attr("text-anchor","end")
        .text("Número de incautaciones");        
        
    //Creación del eje Y y su etiqueta 
    g3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")    
        .call(d3.axisLeft(heightScale3).ticks(null, "s"))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(-45,0) rotate(-90)")
        .text("Cantidad de estupefacientes incautados")        
        .attr("text-anchor","end");
        //.attr("y", heightScale2(heightScale2.ticks().pop()) + 0.5)
    
    //Creación del título de la gráfica
    g3.append("text")
        .attr("class", "Titulo_grafica")
        .attr("transform", "translate(0,-20)")        
        .text("Gráfica 3. Cantidad de estupefacientes incautados VS número de incautaciones")
        .attr("text-anchor","start");
        //.attr("y", heightScale2(heightScale2.ticks().pop()) + 0.5)

    //Descripción de la gráfica
    g3.append("text")
        .attr("class", "axis_label")
        .attr("class", "descripcion_grafica")
        .attr("transform", "translate(0," + (height3 - margin3.top - margin3.bottom + 45)+ ")")    
        .text("Fuente: Grupo Información de Criminalidad (GICRI) - DIJIN de la Policía Nacional")
        .attr("text-anchor","start");
    
});