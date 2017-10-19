//Declaración de las variables espaciales del svg
var width2 = WIDTH,
    height2 = HEIGHT,
    margin2 = {top: 60, right: 80, bottom: 50, left: 80},
    svg2 = d3.select("#d3_02_grafico")
            .append("svg")
            .attr("width", width2)
            .attr("height", height2),
    g2 = svg2.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")"),
    widthScale2 = d3.scaleBand().range([0, width2 - margin2.left - margin2.right]).paddingInner(0.05).align(0.1),
    heightScale2 = d3.scaleLinear().range([height2 - margin2.top - margin2.bottom, 0]),
    colorScale2 = d3.scaleOrdinal(d3.schemeCategory20);
 
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Carga del archivo de datos
d3.csv("resources/data/resumen_02.csv", function (d, i, columns) {
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = (t);
    return d;
}, 
    //Arroja un error en caso que no se carguen bien los datos
    function(error, data) {
    if (error) throw error;
    
    //Imprime los datos en la consola
    console.log("resources/data/resumen_02.csv");
    console.log(data);
    
    //Se define la variable keys que corresponde a los valores numéricos
    var keys = data.columns.slice(2);

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //Creación del tooltip y funciones requeridas
    var tooltip2 = d3.select("body").append("div").attr("class", "toolTip");
    var tipMouseover2 = function(d,i){
        tooltip2
            .style("left", d3.event.pageX + 50 + "px")
            .style("top", d3.event.pageY - 50 +  "px")
            .style("display", "inline-block")
            .html("<strong>Departamento: &nbsp;</strong> " + d.data.Departamento +"<br>" +
                "<strong>Número de Incautaciones: &nbsp; </strong> " + d3.format(",d")((d[1] - d[0]))+"<br>" +
                "<strong>Número Total de Incautaciones: &nbsp; </strong> " + d3.format(",d")(d.data.total)+"<br>" +
                "<strong>Porcentaje: &nbsp;</strong> " + d3.format(".1%")((d[1] - d[0])/d.data.total) +"<br>" +
                "<strong>Posición a nivel nacional: &nbsp; </strong> " + (i + 1));
    };
    
    var tipMouseout2 = function(d) {
        tooltip2.style("display", "none"); // don't care about position!
    };

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //Se ordenan los datos y se define el dominio del eje X, Y y la escala de colores
    data.sort(function(a, b) { return b.total - a.total; });
    widthScale2(data.map(function(d) { return d.Iniciales; }));
    heightScale2.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    colorScale2.domain(keys);

    g2.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
            .attr("fill", function(d) { return colorScale2(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")                             
            .attr("class", "elemento")
            .attr("x", function(d) { return widthScale2(d.data.Iniciales); })
            .attr("y", function(d) { return heightScale2(d[1]); })
            //.transition().duration(1000).delay(function(d,i) { return i * 50; })
            .attr("height", function(d) { return heightScale2(d[0]) - heightScale2(d[1]); })      
            .attr("width", widthScale2.bandwidth())
            .on("mousemove", tipMouseover2)
            .on("mouseout", tipMouseout2)    

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //Creación del eje X y su etiqueta 
    g2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + heightScale2(d3.min(data, function(d) { return d.total; })) + ")")    
        .call(d3.axisBottom(widthScale2))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(" + (width2 - margin2.left - margin2.right) + ",45)")            
        .attr("text-anchor","end")
        .text("Departamentos");        
        
    //Creación del eje Y y su etiqueta 
    g2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")    
        .call(d3.axisLeft(heightScale2).ticks(null, "s"))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(-45,0) rotate(-90)")
        .text("Número de incautaciones")        
        .attr("text-anchor","end");
        //.attr("y", heightScale2(heightScale2.ticks().pop()) + 0.5)
    
    //Creación del título de la gráfica
    g2.append("text")
        .attr("class", "Titulo_grafica")
        .attr("transform", "translate(0,-20)")        
        .text("Gráfica 2. Número de incautaciones realizadas por departamento")
        .attr("text-anchor","start");
        //.attr("y", heightScale2(heightScale2.ticks().pop()) + 0.5)

    //Descripción de la gráfica
    g2.append("text")
        .attr("class", "axis_label")
        .attr("class", "descripcion_grafica")
        .attr("transform", "translate(0," + (heightScale1(d3.min(data, function(d) { return d.total; })) + 45)+ ")")   
        .text("Fuente: Grupo Información de Criminalidad (GICRI) - DIJIN de la Policía Nacional")
        .attr("text-anchor","start");
    
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    //Caja de nomenclaturas
    var legend2 = g2.append("g")
        .attr("class", "convenciones")                
        .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
        .attr("transform", function(d, i) { return "translate(-90," + i * 20 + ")"; });

    legend2.append("rect")
        .attr("x", width2 - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", colorScale2);

    legend2.append("text")
        .attr("x", width2 - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; }); 
});