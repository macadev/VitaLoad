$(document).ready(function() {
  var options = {
    width: 1000,
    height: 600
  };

  var attributes = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    series: [
      [12, 9, 7, 8, 5],
      [2, 1, 3.5, 7, 3],
      [1, 3, 4, 5, 6]
    ]
  };

  var chart = Chartist.Line('.ct-chart', attributes, options);

  setTimeout(function() {

    attributes.series = [
      [1, 2, 3, 4, 5],
      [2, 1, 0, 0, 12],
      [1, 3, 4, 5, 6]
    ]
    
    chart.update();

  }, 4000);

  setInterval(function(){alert("Hello")}, 3000);


});
