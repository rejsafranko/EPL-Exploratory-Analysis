function preprocessBarChartPoints(data) {
    result = []
    for (var i = 0; i < data.length; i++) {
        result.push({
            "Name": data[i].team,
            "Points": data[i].points,
        })
    }
    return result;
}

async function plotClubPoints(fileName) {
    try {
        let test_data = await d3.csv(fileName);

        res = preprocessBarChartPoints(test_data)

        max_races_won = Math.max(...res.map(o => o.Points))


        // set the dimensions and margins of the graph
        var margin = {
                top: 20,
                right: 60,
                bottom: 40,
                left: 60
            },
            width = 910 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#points")
            .append("svg")
            .attr("width", 910 + margin.left + margin.right)
            .attr("height", 600 + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
       
        const x = d3.scaleBand().range([0, width]).domain(res.map(d => d.Name)).padding(0.2);
        svg.append("g")
                .style("font-size", 14)
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .style("fill", "white"); 


        // Y axis
        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        svg.append("g")
            .style("font-size", 14)
            .attr("stroke-width", 0)
            .classed("y-axis", true)
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "white");
        
        //gridlines
        var gridlines = d3.axisLeft().tickFormat("").tickSize(-width).scale(y);
        svg.append("g").attr("class", "grid").call(gridlines);
        // Bars
        svg.selectAll("mybar")
            .data(res)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Name);
            })
            .attr("y", function (d) {
                return y(d.Points);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Points);
            })
            .attr("fill", "rgb(105, 179, 162)");

        svg.selectAll(".text")
            .data(res)
            .enter()
            .append("text")
            .text(function(d){
                return d.Points;
            })
            .attr("x", function (d, i) {
                return x(d.Name) + x.bandwidth() / 2;
            })
            .attr("y", function (d, i) {
                return y(d.Points) - 5;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("fill", "white");

    } catch (exc) {
        console.error(exc)
    }
}