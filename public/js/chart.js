/**
 * Created by Hyungwu Pae on 5/8/17.
 */
(function () {
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

  console.log(languageData);


  const tooltip = d3.select('#chart')
    .append('div')
    .attr('class', 'tooltip-d3');
  tooltip.append('div')
    .attr('class', 'label-d3');

  tooltip.append('div')
    .attr('class', 'count');

  const width = 450;
  const height = 450;
  const donutWidth = 75;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory20);
  const svg = d3.select('#chart')
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
      return d.count;
    })
    .sort(null);

  const g = svg.selectAll('path')
    .data(pie(languageData))
    .enter().append('g');

  const path = g
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d, i) {
      return color(d.data.label);
    });

  //label inside arc
  g.append('text')
    .attr("transform", function (d) { //set the label's origin to the center of the arc
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle") //center the text on it's origin
    .style("fill", "white")
    .style("font", "bold 12px")
    .text(function (d) {
      const total = d3.sum(languageData.map(d => d.count));
      const percent = Math.round(100 * d.data.count / total);
      return percent + '%';
    });

  path.on('mouseover', function (d) {
    tooltip.select('.label-d3').html(d.data.label);
    tooltip.select('.count').html(d.data.count);
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








})();

(function () {
  /**
   * Skill chart
   */
  // Fake JSON data
  console.log(skills);  
  // var myData = {
  //   "Angular": 170,
  //   "React": 393,
  //   "Bootstrap": 122,
  //   "D3": 129,
  //   "RXJS": 189,
  //   "Firebase": 12,
  //   "PostgreSQL": 32,
  //   "SQLite": 25,
  //   "MariaDB": 42,
  //   "Oracle": 12,
  //   "Firebird": 7,
  //   "MS SQL Server": 184,
  //   "CouchDB": 42,
  //   "Redis": 162,
  //   "DB2": 87,
  //   "Teradata": 65,
  //   "Vue.js": 42,
  //   "Backbone.js": 102,
  //   "Ember.js": 12,
  //   "knockout.js": 92,
  //   "Spine": 65,
  //   "Brick": 87,
  //   "Laravel": 98,
  //   "Symfony": 32,
  //   "CodeIgniter": 4,
  //   "CakePHP": 7,
  //   "Phalcon": 8,
  // };

  // var data = Object.keys(myData).map(key => {
  //   return {
  //     className: key,
  //     packageName: Math.floor(Math.random() * 5) + "",
  //     value: myData[key]
  //   };
  // });

  var data = skills.map(skill => {
    let obj = {className: skill.name, value: skill.projects};
    if(skill.database) obj.packageName = "DB";
    else if(skill.frontEnd) obj.packageName = "Front End";
    else if(skill.backEnd) obj.packageName = "Back End";
    else if(skill.testing) obj.packageName = "Testing";
    else if(skill.buildTool) obj.packageName = "Build Tool";
    else obj.packageName = "etc.";
    return obj;
  })

  var data = {
    children: data
  };
  console.log(data);
  var diameter = 450,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeCategory20);

  var bubble = d3.pack()
    .size([diameter, diameter])
    .padding(1.5);

  var svg = d3.select("#graph").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  (function () {
    var root = d3.hierarchy(data)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });

    bubble(root);
    var node = svg.selectAll(".node")
      .data(root.children)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    node.append("title")
      .text(function (d) {
        return d.data.className + ": " + format(d.value);
      });

    node.append("circle")
      .attr("r", function (d) {
        return d.r;
      })
      .style("fill", function (d) {
        return color(d.data.packageName);
      });

    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function (d) {
        return d.data.className.substring(0, d.r / 3);
      });
  })();

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function (child) {
        recurse(node.name, child);
      });
      else classes.push({
        packageName: name,
        className: node.name,
        value: node.size
      });
    }

    recurse(null, root);
    return {
      children: classes
    };
  }

  d3.select(self.frameElement).style("height", diameter + "px");



})();