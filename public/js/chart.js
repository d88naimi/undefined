/**
 * Created by Hyungwu Pae on 5/8/17.
 */
(function(){
  // $.get('/api/project/user')
  console.log(projects);

  // const languageData = [
  //   { label: 'Javascript', count: 26 },
  //   { label: 'C++', count: 15 },
  //   { label: 'Ruby', count: 10 },
  //   { label: 'Scala', count: 8 },
  //   { label: 'Matlab', count: 6 },
  //   { label: 'Haskell', count: 12 },
  //   { label: 'Python', count: 4 }
  // ];


  /**
   * Language Chart
   */
  const languageData = projects.map(pjt => pjt.language)
    .reduce((data, language) => {
      const indexOfLangObj = data.map(langData => langData.label).indexOf(language);
      if(indexOfLangObj > -1) {
        data[indexOfLangObj].count += 1;
      } else {
        data.push({ label: language, count: 1});
      }
      return data;
    },[]);
  
  console.log(languageData);


  const tooltip = d3.select('#chart')
    .append('div')
    .attr('class', 'tooltip-d3');
  tooltip.append('div')
    .attr('class', 'label-d3');

  tooltip.append('div')
    .attr('class', 'count');

  const width = 360;
  const height = 360;
  const donutWidth = 75;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory20);
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
  const arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  const pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

  const g = svg.selectAll('path')
    .data(pie(languageData))
    .enter().append('g');

  const path = g
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d.data.label);
    });

  //label inside arc
  g.append('text')
    .attr("transform", function(d) { //set the label's origin to the center of the arc
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle") //center the text on it's origin
    .style("fill", "white")
    .style("font", "bold 12px")
    .text(function(d) {
      const total = d3.sum(languageData.map(d => d.count));
      const percent = Math.round(100 * d.data.count / total);
      return percent + '%';
    });

  path.on('mouseover', function(d) {
    tooltip.select('.label-d3').html(d.data.label);
    tooltip.select('.count').html(d.data.count);
//      tooltip.select('.percent').html(percent + '%');
    tooltip.style('display', 'block');
  });

  path.on('mouseout', function() {
    tooltip.style('display', 'none');
  });

  path.on('mousemove', function(d) {
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
    .attr('transform', function(d, i) {
      const height = legendRectSize + legendSpacing;
      const offset =  height * color.domain().length / 2;
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
    .text(function(d) { return d; });





  /**
   * Skill chart
   */
  







})();
