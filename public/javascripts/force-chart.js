$(function () {
  var init_temperatures_and_dates;
  var new_temperature;
  var init_dates;
  var init_temperatures;
  var call_id;

  function getNewForce(series) {
    console.log('we are polling' + call_id);

    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_force&last_id=' + call_id, success: function(new_forces) {
      
      new_forces = JSON.parse(new_forces);
      
      //return if ajax call gets empty
      if (!new_forces.length) {
        return;
      }

      //store call_id for next ajax call
      call_id = new_forces[new_forces.length - 1].id;

      //Plot each new datapoint
      _.each(new_forces, function(data_point) {
        console.log(data_point);
        series.addPoint({y: parseFloat(data_point.force), x: new Date(data_point.date_sent)}, true, true);
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
              getNewForce(series);
            }, 1000);
          }
        }
      },
      title: {
        text: 'Force applied'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
            text: 'G Force'
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
                Highcharts.numberFormat(this.y, 2) + 'G';
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
        name: 'G Force',
        data: data
      }]
    });
  }

  $(document).ready(function () {

    //&last_id=260
    $.ajax({url: 'http://198.100.145.140/wh/get-data.php?a=all_force', success: function(result){
      
      var result = JSON.parse(result);
      call_id = result[result.length - 1].id;
      
      data = _.map(result, function(force_date) {
          return { y : parseFloat(force_date.force), x : new Date(force_date.date_sent) };
      });
      
      generateTable(data.slice(data.length - 20, data.length));
    }});
  });
});