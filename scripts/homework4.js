
//dimensions for the chart
const margin = {top: 20, right: 60, bottom: 60, left: 100};
const width = 1100 - margin.left - margin.right;
const height = 560 - margin.top - margin.bottom;

var chartSvg,svg;

var wholeData;
var countryRegionData;
var incomeData;
var lifeExpectancyData;
var populationData;
var childMortalityData;
var childrenPerWomanData;
var x_csv,y_csv;

var data;
var xScale,yScale;
var label1;
var interv;

const colorScale = d3.scaleOrdinal()
                  .range(d3.schemeCategory10);

//adding an event listener to be implemented when the page loads.
document.addEventListener("DOMContentLoaded", function(){
    chartSvg = d3.select("#scatterplotchart");

    //loading all the data from downloaded csv files first.
    Promise.all([d3.csv('data/countries_regions.csv'),
                 d3.csv('data/income_per_person_gdppercapita_ppp_inflation_adjusted_transpose.csv'),
                 d3.csv('data/life_expectancy_years_transpose.csv'),
                 d3.csv('data/population_total_transpose.csv'),
                 d3.csv('data/child_mortality_0_5_year_olds_dying_per_1000_born_transpose.csv'),
                 d3.csv('data/children_per_woman_total_fertility_transpose.csv'),
                 d3.csv('data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'),
                 d3.csv('data/life_expectancy_years.csv'),
                 d3.csv('data/population_total.csv'),
                 d3.csv('data/child_mortality_0_5_year_olds_dying_per_1000_born.csv'),
                 d3.csv('data/children_per_woman_total_fertility.csv')])
            .then(function(values){
                countryRegionData = values[0];
                incomeData = values[1];
                lifeExpectancyData = values[2];
                populationData = values[3];
                childMortalityData = values[4];
                childrenPerWomanData = values[5]
                wholeData = values;

            //console.log(wholeData[1][1]);
            drawChart();
        })
        
        
});

//document.getElementById("text-input-year").addEventListener("change",function(){
//    console.log(document.getElementById("text-input-year").value);
//});

function drawChart(){

    //Getting the X and Y attributes
    X_attr = document.getElementById("dp_x").value;
    console.log(X_attr);
    Y_attr = document.getElementById("dp_y").value;
    console.log(Y_attr);

    x_csv = wholeData[X_attr];
    y_csv = wholeData[Y_attr];
    console.log(x_csv[0]['Afghanistan']);

    //Getting the region
    var region = document.getElementById("world_region").value;
    console.log(region);

    //console.log(wholeData[X_attr]);

    //Getting the year
    var Year = document.getElementById("text-input-year").value;

    document.getElementById("year-input").value = document.getElementById("text-input-year").value;


    document.getElementById("year-input").addEventListener("change",function(){
        console.log(document.getElementById("year-input").value);
        //label1.text(document.getElementById("year-input").value);
        document.getElementById("text-input-year").value = document.getElementById("year-input").value;
        sliderchange();
    });

    console.log(Year);

    //defining X and Y scales
    var max_x = [];
    var max_y = [];
    //getting max data for attribute for all years
    for (i = 1800;i<2021;i++){
        max_x.push(d3.max(wholeData[+X_attr+5],function(d){return +d[i]}));
        //console.log("Year : "+i+" "+d3.max(wholeData[X_attr],function(d){return d[i];}));
    }

    for (i = 1800;i<2021;i++){
        max_y.push(d3.max(wholeData[+Y_attr+5],function(d){return +d[i]}));
        //console.log("Year : "+i+" "+d3.max(wholeData[Y_attr],function(d){return d[i];}));
    }

    max_x = Math.max(...max_x);
    max_y = Math.max(...max_y);
    console.log(max_x+ 0.15*max_x);
    console.log(max_y);

    xScale = d3.scaleLinear()
                .domain([0,max_x + 0.15*max_x])
                .range([0,width]);
    
    yScale = d3.scaleLinear()
                .domain([0,max_y+0.15*max_y])
                .range([height,0]);

    var regionData = countryRegionData.map(function(d) {
        return {
          country: d.name,
          geo: d.geo,
          reg: d['World bank region']
        }
      });

    var data = [];
    regionData.forEach(function (d) {
    var push_csv_values = {};
    push_csv_values['country'] = d.country;
    push_csv_values['reg'] = d.reg;
    push_csv_values['xValues'] = parseFloat(x_csv[+Year - 1800][d.country]);
    push_csv_values['yValues'] = parseFloat(y_csv[+Year - 1800][d.country]);
    push_csv_values['geo'] = d.geo;
    data.push(push_csv_values);
  });

  var colorScheme = d3.schemeCategory10;
  var region_list = ['South Asia', 'Europe & Central Asia', 'Middle East & North Africa', 'Sub-Saharan Africa', 'Latin America & Caribbean', 'East Asia & Pacific', 'North America'];
  var color = colorScheme[region_list.indexOf(region)];

    //console.log(dd);
    console.log(data);

    //console.log(d3.max(wholeData[X_attr],function(d){return +d[1972]}));

    //chartSvg.select('svg').remove();

    //appending g onto the screen
    svg = chartSvg.append("svg")
    .attr("width",width + margin.left + margin.right)
    .attr("height",height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    var div = d3.select("#wrapper").append("div")
     .attr("class", "tooltip-line")
     .style("opacity", 0);

    //adding the axes and the lables

    const yAxis = d3.axisLeft(yScale);
            svg.append('g')
            .attr('class','axis')
            .call(yAxis);
    const xAxis = d3.axisBottom(xScale);
            svg.append('g')
            .attr('class','axis')
            .call(xAxis)
                    .attr('transform',`translate(0,${height})`);
    
    svg.append('text')
        .attr('x',width/2)
        .attr('y',height+40)
        .text("Income")
        .style("fill","gray");

           var label1 = svg.append("text")
    .attr("class", "year label")
    .attr("ID","labelyearid")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(Year)
    .style("opacity","0.6");

    svg.append('text')
        .attr('transform','rotate(-90)')
        .attr('y','-75px')
        .attr('x',-height/2)
        .attr('text-anchor','middle')
        .text("Life Expectancy")
        .style("fill","gray");

        var circdata = svg.selectAll('circle')
        .data(data);
        
        circdata
        .enter()
        .append('circle')
        .filter(function(d){return !isNaN(d['xValues']) && !isNaN(d['yValues'])})
        .attr('cx', d => xScale(d['xValues']))
        .attr('cy', d => yScale(d['yValues']))
        .attr('r',20)
        .style('opacity',.6)
        .attr("fill", function (d) { return colorScale(d.reg); })
        .style('stroke','gray')
        .on('mouseover', function(d,i) {
           //console.log('mouseover on ' + d.country);
           d3.select(this).classed('highlighted_country',true);
           country_label.text(d.country)
           .style("opacity","1");
           div.transition().duration(50)
            .style("opacity",1);
            div.html("Country: "+d.country)
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
         })
        .on('mouseout', function(d,i) {
         //console.log('mouseout on ' + d.country);
           d3.select(this).classed('highlighted_country',false);
          country_label.text("")
           .style("opacity","0");
           div.transition().duration(50)
            .style("opacity",0);         
         });

         svg.selectAll(null)
         .data(data)
         .enter()
         .append("text")
         .attr("x", function (d) { return xScale(d['xValues']); })
         .attr("y", function (d) { return yScale(d['yValues']); })
         .style("text-anchor", "middle")
         .style("fill", "#F5FFFE")
         .text(function (d) {
           if (!isNaN(d['xValues']) && !isNaN(d['yValues'])) {
             return d['geo'];
           };
         });
     
    var country_label = svg.append("text")
    .attr("class", "country overhover")
    .attr("text-anchor", "start")
    .attr("y",48+margin.top)
    .attr("x",25)
    .text("")
    .style("opacity","0.8");

    document.getElementById("text-input-year").addEventListener('change',animate_circle());
    document.getElementById("dp_x").addEventListener('change',animate_circle());
    document.getElementById("dp_y").addEventListener('change',animate_circle());

    //animate_circle();

}

function togglePlay(x){
    //x.classList.toggle("fa-pause");
    var anim_val = 0;
        x.addEventListener('click',function(){
            anim_val = 0;
            });
    if(x.classList.contains("fa-play")){
        x.classList.remove("fa-play");
        x.classList.add("fa-pause");
        anim_val = 1;
        console.log(anim_val);
        var yr;
        //while(anim_val == 1){
            interv = setInterval(function(){
                yr = document.getElementById("text-input-year").value;
            yr = +yr+1;
            if(yr == 2020)
            {
                clearInterval(interv);
                document.getElementById("text-input-year").value = "1800"
            }
            document.getElementById("text-input-year").value = yr.toString();
            console.log(document.getElementById("text-input-year").value);
            animate_circle();
            },1000)
            //setTimeout(() => { console.log("World!"); }, 2000);
        //}
    }
    else if(x.classList.contains("fa-pause")){
        x.classList.remove("fa-pause");
        x.classList.add("fa-play");
        console.log(anim_val);
        clearInterval(interv);
    }
}

function sliderchange(){
    drawChart();
}

function animate_circle(){

    X_attr = document.getElementById("dp_x").value;
    console.log(X_attr);
    Y_attr = document.getElementById("dp_y").value;
    console.log(Y_attr);

    var x_label,y_label;

    x_csv = wholeData[X_attr];
    y_csv = wholeData[Y_attr];

    if(X_attr == 1){
        x_label = "Income"
    }
    else if (X_attr == 2){
        x_label = "Life Expectancy"
    }
    else if (X_attr == 3){
        x_label = "Population"
    }
    else if (X_attr == 4){
        x_label = "Child Mortality"
    }
    else if (X_attr == 5){
        x_label = "Children per woman"
    }

    if(Y_attr == 1){
        y_label = "Income"
    }
    else if (Y_attr == 2){
        y_label = "Life Expectancy"
    }
    else if (Y_attr == 3){
        y_label = "Population"
    }
    else if (Y_attr == 4){
        y_label = "Child Mortality"
    }
    else if (Y_attr == 5){
        y_label = "Children per woman"
    }

    //Getting the region
    var region = document.getElementById("world_region").value;
    console.log(region);

    //console.log(wholeData[X_attr]);

    //Getting the year
    var Year = document.getElementById("text-input-year").value;

    document.getElementById("year-input").value = document.getElementById("text-input-year").value;


    document.getElementById("year-input").addEventListener("change",function(){
        console.log(document.getElementById("year-input").value);
        //label1.text(document.getElementById("year-input").value);
        document.getElementById("text-input-year").value = document.getElementById("year-input").value;
        sliderchange();
    });

    console.log(Year);

    //defining X and Y scales
    var max_x = [];
    var max_y = [];
    //getting max data for attribute for all years
    for (i = 1800;i<2021;i++){
        max_x.push(d3.max(wholeData[+X_attr+5],function(d){return +d[i]}));
        //console.log("Year : "+i+" "+d3.max(wholeData[X_attr],function(d){return d[i];}));
    }

    for (i = 1800;i<2021;i++){
        max_y.push(d3.max(wholeData[+Y_attr+5],function(d){return +d[i]}));
        //console.log("Year : "+i+" "+d3.max(wholeData[Y_attr],function(d){return d[i];}));
    }

    max_x = Math.max(...max_x);
    max_y = Math.max(...max_y);
    console.log(max_x);
    console.log(max_y);

    xScale = d3.scaleLinear()
                .domain([0,max_x+ 0.15*max_x])
                .range([0,width]);
    
    yScale = d3.scaleLinear()
                .domain([0,max_y +0.15*max_y])
                .range([height,0]);

    var regionData = countryRegionData.map(function(d) {
        return {
          country: d.name,
          geo: d.geo,
          reg: d['World bank region']
        }
      });

    var data = [];
    regionData.forEach(function (d) {
    var push_csv_values = {};
    push_csv_values['country'] = d.country;
    push_csv_values['reg'] = d.reg;
    push_csv_values['xValues'] = parseFloat(x_csv[+Year - 1800][d.country]);
    push_csv_values['yValues'] = parseFloat(y_csv[+Year - 1800][d.country]);
    push_csv_values['geo'] = d.geo;
    data.push(push_csv_values);
  });

  console.log(data);

  var colorScheme = d3.schemeCategory10;
  var region_list = ['South Asia', 'Europe & Central Asia', 'Middle East & North Africa', 'Sub-Saharan Africa', 'Latin America & Caribbean', 'East Asia & Pacific', 'North America'];
  var color = colorScheme[region_list.indexOf(region)];

    chartSvg.selectAll('text').remove();
    chartSvg.selectAll('.axis').remove();

    var div = d3.select("body").append("div")
     .attr("class", "tooltip-line")
     .style("opacity", 0);

    const yAxis = d3.axisLeft(yScale);
            svg.append('g')
            .attr('class','axis')
            .call(yAxis);
    const xAxis = d3.axisBottom(xScale);
            svg.append('g')
            .attr('class','axis')
            .call(xAxis)
                    .attr('transform',`translate(0,${height})`);

    svg.append('text')
        .attr('x',width/2)
        .attr('y',height+40)
        .text(x_label)
        .style("fill","gray");

    svg.append('text')
        .attr('transform','rotate(-90)')
        .attr('y','-75px')
        .attr('x',-height/2)
        .attr('text-anchor','middle')
        .text(y_label)
        .style("fill","gray");

     var country_label = svg.append("text")
    .attr("class", "country overhover")
    .attr("text-anchor", "start")
    .attr("y",48+margin.top)
    .attr("x",25)
    .text("")
    .style("opacity","0.8");

    label1 = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(Year)
    .style("opacity","0.6");


        var circ = svg.selectAll('circle')
        .data(data);
        //.filter(function(d) {return d.reg == region});
    
        if(region == 'all')
        {
            circ
        .transition()
        .duration(1000)
        .filter(function(d){return !isNaN(d['xValues']) && !isNaN(d['yValues'])})
        //.filter(function(d){return d.reg==region})
        .attr('cx', d => xScale(d['xValues']))
        .attr('cy', d => yScale(d['yValues']))
        .attr("fill", function (d) { return colorScale(d.reg); })
        .style('opacity',.6)
        .style('stroke','gray');
        }

        else{
            circ
        .transition()
        .duration(1000)
        .filter(function(d){return !isNaN(d['xValues']) && !isNaN(d['yValues'])})
        .filter(function(d){return d.reg==region})
        .attr('cx', d => xScale(d['xValues']))
        .attr('cy', d => yScale(d['yValues']))
        .attr("fill", function (d) { return colorScale(d.reg); })
        .filter(function(d){return d.reg==region})
        .style('opacity',.6)
        .style('stroke','gray');
        }

        // circ.join(
        //     enter => enter.append('circle')
        //         .transition()
        //         .duration(1000)
        //         .attr('cx', d => xScale(d['xValues']))
        //         .attr('cy', d => yScale(d['xValues']))
        //         .style('opacity',.6)
        //         .style('stroke','gray'),
        //     update => update
        //     .transition()
        //     .duration(1000)
        //     .attr('cx', d => xScale(d['xValues']))
        //     .attr('cy', d => yScale(d['xValues']))
        //     //.attr("fill", function (d) { return color; })
        //     .style('opacity',.6)
        //     .style('stroke','gray'),
        //     exit => exit
        //     .transition()
        //     .duration(1000)
        //     .attr('cx', d => xScale(d['xValues']))
        //     .attr('cy', d => yScale(d['xValues']))
        //     .style('opacity',0)
        //     .remove()
        //   );
    
        circ.on('mouseover', function(d,i) {
            //console.log('mouseover on ' + d.country);
            d3.select(this).classed('highlighted_country',true);
            country_label.text(d.country)
            .style("opacity","1");
            div.transition().duration(50)
            .style("opacity",1);
            div.html("Country: "+d.country)
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
          });
         circ.on('mouseout', function(d,i) {
          console.log('mouseout on ' + d.country);
            d3.select(this).classed('highlighted_country',false);
           country_label.text("")
            .style("opacity","0");   
            div.transition().duration(50)
            .style("opacity","0");      
          });;


          svg.selectAll(null)
         .data(data)
         .enter()
         .append("text")
         .attr("x", function (d) { return xScale(d['xValues']); })
         .attr("y", function (d) { return yScale(d['yValues']); })
         .style("text-anchor", "middle")
         .style("font-size",'9px')
         .style("fill", '#F5FFFE')
         .text(function (d) {
           if (!isNaN(d['xValues']) && !isNaN(d['yValues'])) {
             return d['geo'];
           };
         });
console.log("Entered");
    
}

function anim_circle_reg(){

    var region = document.getElementById("world_region").value;

    var circles = svg.selectAll('circle');

    circles
    .transition()
        .duration(1000)
        .style('opacity',0)
        .end()
        .then(() => {
            if(region != 'all'){

                circles
                .transition()
        .duration(1000)
        //.filter(function(d){return !isNaN(d['xValues']) && !isNaN(d['yValues'])})
        .filter(function(d){return d.reg==region})
        .attr('cx', d => xScale(d['xValues']))
        .attr('cy', d => yScale(d['yValues']))
        .attr("fill", function (d) { return colorScale(d.reg); })
        //.filter(function(d){return d.reg==region})
        .style('opacity',.6)
        .style('stroke','gray');

            }
            else{
                circles
                .transition()
        .duration(1000)
        .filter(function(d){return !isNaN(d['xValues']) && !isNaN(d['yValues'])})
        //.filter(function(d){return d.reg==region})
        .attr('cx', d => xScale(d['xValues']))
        .attr('cy', d => yScale(d['yValues']))
        .attr("fill", function (d) { return colorScale(d.reg); })
        .style('opacity',.6)
        .style('stroke','gray');
            }
        });

        var symb = svg.selectAll(null);

        symb
        .transition()
        .duration(1000)
        .style('opacity',0);
} 