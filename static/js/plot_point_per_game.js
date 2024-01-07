function preprocessScatterPlotData(data) {
    var result = []

}

async function plotPointsPerClub(fileName) {
    try {
        let d = await d3.json(fileName);
        for(let cons of d){
            cons.positions = cons.positions.sort((a, b) => (parseFloat(a.points) > parseFloat(b.points))? 1: -1)
        }
        test_data = d;
        let num_of_races = test_data[0].positions.length
        let num_of_teams = test_data.length
        

        // set the dimensions and margins of the graph
        var margin = {
                top: 20,
                right: 30,
                bottom: 40,
                left: 90
            },
            width = 25 * num_of_races + 275 - margin.left - margin.right,
            height = 1200 - margin.top - margin.bottom;



        // append the svg object to the body of the page
        var svg = d3.select("#points-per-club")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain([1, num_of_races])
            .range([0, 25 * num_of_races]);

        svg.append("g")
            .attr("transform", "translate(0," + (height + 15) + ")")
            .call(d3.axisBottom(x).ticks(num_of_races, "f"));

        let max_points = Math.max.apply(Math, test_data.map(function (o) {
            return o.positions[o.positions.length - 1].points;
        }))


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, max_points])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Set the desired tick values on the left y-axis
        var leftTickValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110]; // Add more values as needed
        svg.append("g")
            .call(d3.axisLeft(y).tickValues(leftTickValues));

        svg.append("g")
            .call(d3.axisRight(y).ticks(300))
            .classed("constructor-axis", true)
            .attr("transform", "translate(" + (25 * num_of_races + 15) + ",0)")
            .call(d3.axisRight(y).tickValues(
                test_data.map((team) => team.positions[team.positions.length - 1].points)
            ).tickFormat((y) => {
                for (var team of test_data) {
                    if (team.positions[team.positions.length - 1].points == y) {
                        return team.team
                    }
                }
                return "";
            }));

        // create a tooltip
        var tooltip = d3.select("#points-per-club-tooltip");


        for (var team of test_data) {
            // Add the line
            svg.append("path")
                .datum(team.positions)
                .attr("fill", "none")
                .attr("stroke", team.color)
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d, i) {
                        return x(i + 1)
                    })
                    .y(function (d) {
                        return y(d.points)
                    })
                )
            for (var position of team.positions) {
                position.team = team.team
            }
            // Add the points
            svg.append("g")
                .selectAll("dot")
                .data(team.positions)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) {
                    return x(i + 1)
                })
                .attr("cy", function (d) {
                    return y(d.points)
                })
                .attr("r", 5)
                .attr("fill", team.color)
                .on("mouseover", function () {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function (e, d) {
                    return tooltip.style("top", (event.pageY + 20) + "px")
                        .style("left", (event.pageX) + "px")
                        .text("Team: " + d.team + "\nPoints: " + d.points);
                })
                .on("mouseout", function () {
                    return tooltip.style("visibility", "hidden");
                });
        }
    } catch (exc) {
        console.error(exc)
    }
}