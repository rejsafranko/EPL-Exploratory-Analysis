function preprocessBarChartAttStat(data, club_name) {
    result = []
    columns = ['Shots on target', 'Header Goals', 'Penalty Goals', 'Free Kick Goals', 'Inside Box Goals', 'Outsied Box Goals', 'Goals Counter Att', 'Offsides']
    columns1 = ['ontarget_scoring_att', 'att_hd_goal', 'att_pen_goal', 'att_freekick_goal', 'att_ibox_goal', 'att_obox_goal', 'goal_fastbreak', 'total_offside']
    for (var i = 0; i < data.length; i++) {
        if (data[i].team == club_name) {
            for (var j = 0; j < columns.length; j++) {
                result.push({
                    "Name": columns[j],
                    "Stats": data[i][columns1[j]]
                })
            }
        }
    }
    return result;
}

async function plotClubAttStatistic(fileName, club_name) {
    try {
        let test_data = await d3.csv(fileName);

        res = preprocessBarChartAttStat(test_data, club_name)

        max_value = Math.max(...res.map(o => o.Stats))


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
        var svg = d3.select("#club-attacking-statistics")
            .append("svg")
            .attr("width", 910 + margin.left + margin.right)
            .attr("height", 630 + margin.top + margin.bottom)
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
            .domain([0, max_value])
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
                return y(d.Stats);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Stats);
            })
            .attr("fill", "rgb(105, 179, 162)");

        svg.selectAll(".text")
            .data(res)
            .enter()
            .append("text")
            .text(function(d){
                return d.Stats;
            })
            .attr("x", function (d, i) {
                return x(d.Name) + x.bandwidth() / 2;
            })
            .attr("y", function (d, i) {
                return y(d.Stats) - 5;
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