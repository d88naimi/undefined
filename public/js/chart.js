/**
 * Created by Hyungwu Pae on 5/8/17.
 */
(function () {

  /**
   * Language Chart
   */
  const languageData = projects.map(pjt => pjt.language)
    .reduce((data, language) => {
      const indexOfLangObj = data.map(langData => langData.label).indexOf(language);
      if (indexOfLangObj > -1) {
        data[indexOfLangObj].count += 1;
      } else {
        data.push({
          label: language,
          count: 1
        });
      }
      return data;
    }, []);

  drawPieChart(languageData, "#pieChartLang", "label", "count");


  function drawPieChart(data, id, label, count, legendTextSize) {
    const tooltip = d3.select(id)
      .append('div')
      .attr('class', 'tooltip-d3');
    tooltip.append('div')
      .attr('class', 'label-d3');

    const width = 450;
    const height = 450;
    const donutWidth = 75;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const svg = d3.select(id)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
    const arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    const pie = d3.pie()
      .value(function (d) {
        return d[count];
      })
      .sort(null);

    const g = svg.selectAll('path')
      .data(pie(data))
      .enter().append('g');

    const path = g
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) {
        return color(d.data[label]);
      });

    //label inside arc
    g.append('text')
      .attr("transform", function (d) { //set the label's origin to the center of the arc
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "white")
      .style("font", "bold 15px")
      .text(function (d) {
        const total = d3.sum(data.map(d => d[count]));
        const percent = Math.round(100 * d.data[count]/ total);
        return percent + '%';
      });

    path.on('mouseover', function (d) {
      tooltip.select('.label-d3').html(d.data[label]+ ": " + d.data[count]);
      // tooltip.select('.count').html(d.data.count);
      //      tooltip.select('.percent').html(percent + '%');
      tooltip.style('display', 'block');
    });

    path.on('mouseout', function () {
      tooltip.style('display', 'none');
    });

    path.on('mousemove', function (d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX + 10) + 'px');
    });

    const legendRectSize = 18;
    const legendSpacing = 4;
    const legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        const height = legendRectSize + legendSpacing;
        const offset = height * color.domain().length / 2;
        const horz = -2 * legendRectSize;
        const vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .style('fill', 'white')
      .text(function (d) {
        return d;
      });

  }

  /**
   * Skill Type Chart
   */
  const skillData = skills.map(skill => {
    let obj = {skillName: skill.name, value: skill.projects};
    if(skill.database) obj.skillType = "DB";
    else if(skill.frontEnd) obj.skillType = "Front End";
    else if(skill.backEnd) obj.skillType = "Back End";
    else if(skill.testing) obj.skillType = "Testing";
    else if(skill.buildTool) obj.skillType = "Build Tool";
    else obj.skillType = "etc.";
    return obj;
  });

  const skillTypeObj = skillData.reduce((result, skill) => {
    if(result.hasOwnProperty(skill.skillType)) result[skill.skillType] +=1;
    else result[skill.skillType] = 1;
    return result;
  },{});

  const skillTypeArry = Object.keys(skillTypeObj).map(type => ({label: type, count: skillTypeObj[type]}));

  drawPieChart(skillTypeArry, "#pieChartType", "label", "count");


  /**
   * Skill chart
   */
  // Fake JSON data


  const data = {
    children: skillData
  };
  console.log(data);
  const diameter = 450,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeCategory10);

  const bubble = d3.pack()
    .size([diameter, diameter])
    .padding(1.5);

  const svg = d3.select("#bubbleChart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  (function () {
    const root = d3.hierarchy(data)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });

    bubble(root);
    const node = svg.selectAll(".node")
      .data(root.children)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    node.append("title")
      .attr('class', 'tooltip-d3')
      .text(function (d) {
        return d.data.skillName + ": " + format(d.value);
      });

    node.append("circle")
      .attr("r", function (d) {
        return d.r;
      })
      .style("fill", function (d) {
        return color(d.data.skillType);
      });

    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .text(function (d) {
        return d.data.skillName.substring(0, d.r / 3);
      });
  })();

  d3.select(self.frameElement).style("height", diameter + "px");



})();