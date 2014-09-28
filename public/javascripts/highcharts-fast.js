$(function () {
  var init_temperatures_and_dates;
  var new_temperature;
  var init_dates;
  var init_temperatures;
  var call_id;

  function getNewTemperature(series) {
    console.log('ICI!!!!!!!');
    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_temp&last_id=' + call_id, success: function(new_temperatures) {
      call_id = new_temperatures[new_temperatures.length - 1].id;

      data_set = _.map(new_temperatures, function(new_data) {
        return { y : parseFloat(new_data.temp), x : new Date(new_data.date_sent) };
      });

      _.each(data_set, function(data_point) {
        series.addPoint([data_point.x, data_point.y], true, true);
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
              setInterval(getNewTemperature(series), 5000);
              
              
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
        name: 'Random data',
        data: data
      }]
    });
  }

  $(document).ready(function () {

    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_temp', success: function(result){
      var result = JSON.parse(result);
      call_id = result[result.length - 1].id;
      console.log(result[result.length - 1]);
      data = _.map(result, function(temp_date) {
        return { y : parseFloat(temp_date.temp), x : new Date(temp_date.date_sent) };
      });
      console.log(data[0]);
      
      generateTable(data);
    }});
  });
});