// var trace1 = {
//   x: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
//   y: [219, 146, 112, 127, 124, 180, 236, 207, 236, 263, 350, 430, 474, 526, 488, 537, 500, 439],
//   name: 'Rest of world',
//   marker: {color: 'rgb(55, 83, 109)'},
//   type: 'bar'
// };

// var trace2 = {
//   x: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
//   y: [16, 13, 10, 11, 28, 37, 43, 55, 56, 88, 105, 156, 270, 299, 340, 403, 549, 499],
//   name: 'China',
//   marker: {color: 'rgb(26, 118, 255)'},
//   type: 'bar'
// };

// var trace1;
// var trace2;
// var trace3;

$.get("http://localhost/chart", function(data, status){}).done(function(data, status){

    console.log(data);
    var trace1 = {
      x: data.x,
      y: data.active,
      name: 'Active',
      marker: {color: 'rgba(255, 147, 0, 0.5)'},
      type: 'bar'
    };

    var trace2 = {
      x: data.x,
      y: data.recovered,
      name: 'Recovered',
      marker: {color: '#00800087'},
      type: 'bar'
    };

    var trace3 = {
      x: data.x,
      y: data.deaths,
      name: 'Deaths',
      marker: {color: '#ff00007d'},
      type: 'bar'
    };


    var data = [trace1, trace2, trace3];

    var layout = {
      title: 'Pattern',
      xaxis: {tickfont: {
          size: 14,
          color: 'rgb(107, 107, 107)'
        }},
      yaxis: {
        title: 'Counts',
        titlefont: {
          size: 16,
          color: 'rgb(107, 107, 107)'
        },
        tickfont: {
          size: 14,
          color: 'rgb(107, 107, 107)'
        }
      },
      legend: {
        x: 0,
        y: 1.0,
        bgcolor: 'rgba(255, 255, 255, 0)',
        bordercolor: 'rgba(255, 255, 255, 0)'
      },
      barmode: 'relative',
      bargap: 0.15,
      bargroupgap: 0.1
    };

    Plotly.newPlot('chart', data, layout,  {responsive: true});
});

