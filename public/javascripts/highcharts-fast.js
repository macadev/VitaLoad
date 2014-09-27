$(function () {
  var init_temperatures_and_dates;
  var new_temperature;
  var init_dates;
  var init_temperatures;

  function getInitialTemperatures() {
    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_temp', success: function(result){
      init_temperatures_and_dates = result;
      console.log(result);
    }});

    //NOTE: temp might be a string in DB, possible bug here.
    data = _.map(init_temperatures_and_dates, function(temp_date) {
      return { x : temp_date.temp, y : temp_date.date_sent };
    });
    
    if (result.length > 20) {
      return data.splice(data.length - 20, data.length);
    }
    return data;  
  }

  function getNewTemperature() {
    $.ajax({url: ' ', success: function(new_emperature) {
      new_temperature = new_temperature;
    }})
  }

  $(document).ready(function () {
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
                  var x = (new Date()).getTime(), // current time
                      y = Math.random();
                  series.addPoint([x, y], true, true);
              }, 1000);
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
        data: getInitialTemperatures();
          /*
          function () {
              // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: Math.random()
              });
            }
            return data;
          }())
          */
      }]
    });
  });
});