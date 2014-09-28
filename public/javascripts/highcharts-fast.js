// #A09F9

$(function () {
  var init_temperatures_and_dates;
  var new_temperature;
  var init_dates;
  var init_temperatures;
  var call_id;

  function getNewTemperature(series) {
    //put call ID BACK IN HERE!
    console.log('we are polling' + call_id);
    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_temp&last_id=' + call_id, success: function(new_temperatures) {
      //console.log(new_temperatures);
      new_temperatures = JSON.parse(new_temperatures);
      if (!new_temperatures.length) {
        return;
      }
      call_id = new_temperatures[new_temperatures.length - 1].id;

      _.each(new_temperatures, function(data_point) {
        console.log(data_point);
        //the true booleans specifies that we want to SHIFT the first point
        //upon adding a new one.
        series.addPoint({y: parseFloat(data_point.temp), x: new Date(data_point.date_sent)}, true, true);
      }); 
    }});
  }

  function generateTable(data) {

    Highcharts.setOptions({
      global: {
          useUTC: false
      }
    });

    $('#container').highcharts({
      chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          
          load: function () {
              //select the only series we have
              var series = this.series[0];
              
              //poll every 5 seconds for new temperature to be plotted
              setInterval(function () { 
                getNewTemperature(series);
              }, 1000);
              
              
              // setInterval(function () {
              //     var x = (new Date()).getTime(), // current time
              //         y = Math.random();
              //     series.addPoint([x, y], true, true);
              // }, 5000);
              
          }
        }
      },
      title: {
        text: 'Temperature'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
            text: 'Temperature in Celcius'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        color: '#F4343A',
        name: 'Random data',
        data: data
      }]
    });
  }

  $(document).ready(function () {

    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_temp&last_id=210', success: function(result){
      
      var result = JSON.parse(result);
      call_id = result[result.length - 1].id;
      
      data = _.map(result, function(temp_date) {
          return { y : parseFloat(temp_date.temp), x : new Date(temp_date.date_sent) };
      });
      
      generateTable(data);
    }});
  });
});