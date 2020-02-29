const width = 960;
const height = 500;
const margin = { top: 20, bottom: 40, left: 30, right: 30 };

const svg = d3.select("svg#vis");
svg.attr("width", width);
svg.attr("height", height);

const plot = svg.append("g").attr("id", "plot");
plot.attr("transform", translate(margin.left, margin.top));

const keys = ["Par Rank", "K Rank", "Count"];
const types = ["public", "private non-profit", "for-profit"];

d3.tsv("college_data.tsv").then(draw);

function draw(data) {
  let x = d3.scalePoint().range([0, width - margin.left - margin.right]).domain(keys);

  let y = new Map(
    Array.from(
      keys,
      key => [key, d3.scaleLinear(d3.extent(data, d => +d[key]), [height - margin.top - margin.bottom, 0])])
  );

    function linepath(d) {
        return d3.line()(keys.map(function(p) { return [x(p), y.get(p)(d[p])]; }));
    }

    let colors = d3.scaleOrdinal()
      .domain(["1", "2", "3"])
      .range(["#0000FF", "#00ff00", "#ff0000"]);

    plot.selectAll("dataLines")
      .data(data)
      .enter()
      .append("path")
      .attr("d",  linepath)
      .style("fill", "none")
      .style("stroke", d => colors(d["Type"]))
      .style("opacity", 0.4);

    plot.selectAll("axis")
      .data(keys)
      .enter()
      .append("g")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y.get(d))); })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -5)
      .text(function(d) { return d; })
      .style("fill", "black");

    let legendColors = d3.scaleOrdinal()
      .domain(["public", "private non-profit", "for-profit"])
      .range(["#0000FF", "#00ff00", "#ff0000"]);

    plot.selectAll("legend")
      .data(types)
      .enter()
      .append("text")
      .text(function(d) { return d })
      .attr("x", function(d, x) { return x * 170 + 300 })
      .attr("y", height - 30)
      .style("fill", d => legendColors(d))
      .attr("text-anchor", "middle")
}

function translate(x, y) {
  return "translate(" + String(x) + "," + String(y) + ")";
}
