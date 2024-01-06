function preprocessBarChartDataTitles(data) {
    result = []
    for (var i = 0; i < data.length; i++) {
        result.push({
            "Name": data[i].teams,
            "Value": data[i].titles,
            "Season": data[i].season
        })
    }

    return result;
}

async function plotMostTitles(fileName) {
    try {
        let test_data = await d3.csv(fileName);

        res = preprocessBarChartDataTitles(test_data)
        max_races_won = Math.max(...res.map(o => o.Value))


        // set the dimensions and margins of the graph
        var margin = {
                top: 20,
                right: 30,
                bottom: 40,
                left: 30
            },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#most_titles")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleBand()
            .domain(res.map(o => o.Name))
            .range([0, width]);
        svg.append("g")
            .attr("stroke-width", 0)
            .classed("x-axis", true)
            .call(d3.axisBottom(x))
            .attr("transform", `translate(0,${height})`)
            .selectAll('.x-axis .tick text') // select all the x tick texts
            .style("fill", "white")
            .call(function (t) {
                t.each(function (d) { // for each one
                    var self = d3.select(this);
                    var s = self.text().split(' '); // get the text and split it
                    self.text(''); // clear it out
                    self.append("tspan") // insert two tspans
                        .attr("x", 0)
                        .attr("dy", ".8em")
                        .text(s[0]);
                    self.append("tspan")
                        .attr("x", 0)
                        .attr("dy", "1.0em")
                        .text(s[1]);
                })
            });

        // Y axis
        var y = d3.scaleLinear()
            .domain([0, max_races_won])
            .range([height, 0]);

        svg.append("g")
            .attr("stroke-width", 0)
            .classed("y-axis", true)
            .call(d3.axisLeft(y))
        
        const tooltip = d3.select("#tooltip").style("opacity", 0);
        var mouseover = function (event, res) {
            tooltip.transition().duration(200).style("opacity", 10);
            tooltip.html('Winning seasons: ' + res.Season)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");

            d3.select(this).classed("highlighted_bar", true);
        };

        var mousemove = function (event, d) {
            d3.select(this).classed("highlighted_bar", true);
            tooltip.style("left", event.pageX + 50 + "px");
            tooltip.style("top", event.pageY + 20 + "px");
        };

        const mouseleave = function (event, d) {
            tooltip.transition().duration(200).style("opacity", 0);
            d3.select(this).classed("highlighted_bar", false);
        };

        // Bars
        svg.selectAll("mybar")
            .data(res)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Name);
            })
            .attr("y", function (d) {
                return y(d.Value);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Value);
            })
            .attr("fill", "rgb(105, 179, 162)")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        svg.selectAll(".text")
            .data(res)
            .enter()
            .append("text")
            .text(function(d){
                return d.Value;
            })
            .attr("x", function (d, i) {
                return x(d.Name) + x.bandwidth() / 2;
            })
            .attr("y", function (d, i) {
                return y(d.Value) - 5;
            })
            .style("fill", "white")
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .on("mouseover", mouseover);

    } catch (exc) {
        console.error(exc)
    }
}