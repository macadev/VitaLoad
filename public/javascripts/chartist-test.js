$(document).ready(function() {
  
  var options = {
    width: 1000,
    height: 600
  };

  var attributes = {
    labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    series: [
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    ],
  };

  var chart = Chartist.Line('.ct-chart', attributes, options);

  var i = 10;
  setInterval(function(){
    attributes.series[0].shift();
    attributes.series[0].push(i*Math.random());
    chart.update();
  }, 400);

  /*
  for(var i = 0; i < 200; i++) {
    setTimeout(function () {
      console.log('we are here');
      attributes.series[0][1] = i;
      chart.update();
    }, 2000);
  }
  */

});
