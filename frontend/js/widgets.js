$(document).ready(function () {
  let help;
  let help2 = $("classificaRegioni");
  let numItalia = {};
  console.log("hallo")
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/regional_data/worst",
    data: null,
    success: function (done) {
        for (i = 0; i < 3; i++)
            help[i] = done[i];
            help2.html("<div class=\"row mb-15\">"+
            +"<div class=\"col-9\">"+help[i].nomeRegione+"</div>"+
            +"<div class=\"col-3 text-right\">"+(help[i].percentuale * 100)+"</div>"+
            +"<div class=\"col-12\">"
                +"<div class=\"progress progress-sm mt-5\">"+
                    +"<div class=\"progress-bar bg-green\" role=\"progressbar\" style=\"width:"+(help[i].percentuale * 100)+"%\" aria-valuenow=\""+(help[i].percentuale * 100)+"\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>"+
                +"</div>"+
            +"</div>"+
        +"</div>")
    }
  });

  $.ajax({
    type: "GET",
    url: "/home/numItalia",
    data: null,
    success: function (done) {
        numItalia = done;
    }
  });
  
  

    $(function() {
      'use strict';
      jQuery('#visitfromworld').vectorMap({
        map: 'it_mill',
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderOpacity: 0,
        borderWidth: 0,
        zoomOnScroll: false,
        color: '#93d5ed',
        regionStyle: {
          initial: {
            fill: '#bce2fb',
            'stroke-width': 1,
            stroke: '#fff'
          }
        },
        markerStyle: {
          initial: {
            r: 5,
            fill: '#93d5ed',
            'fill-opacity': 1,
            stroke: '#93d5ed',
            'stroke-width': 1,
            'stroke-opacity': 1
          }
        },
        enableZoom: true,
        hoverColor: '#79e580',
        markers: [
          {
            latLng: [help[0].lat, help[0].long],
            name: help[0].nomeRegione+" : "+help[0].contagiati,
            style: { fill: '#2961ff' }
          },
          {
            latLng: [help[1].lat, help[1].long],
            name: help[1].nomeRegione+" : "+help[1].contagiati,
            style: { fill: '#ff821c' }
          },
          {
            latLng: [help[2].lat, help[2].long],
            name: help[2].nomeRegione+" : "+help[2].contagiati,
            style: { fill: '#40c4ff' }
          },
        ],
        hoverOpacity: null,
        normalizeFunction: 'linear',
        scaleColors: ['#93d5ed', '#93d5ee'],
        selectedColor: '#c9dfaf',
        selectedRegions: [],
        showTooltip: true,
        onRegionClick: function(element, code, region) {
          var message =
            'You clicked "' +
            region +
            '" which has the code: ' +
            code.toUpperCase();
          alert(message);
        }
      });
      $('#datepickerwidget').datetimepicker({
          inline: true,
          format: 'L'
      });
      var ps = new PerfectScrollbar(".scrollable", {
          wheelSpeed: 10,
          wheelPropagation: true,
          minScrollbarLength: 5
      });
  
})


    (function($) {
      var c3DonutChart = c3.generate({
        bindto: '#c3-donut-chart',
        data: {
          columns: [
            ['Contagiati totali', numItalia.contagiati],
            ['Guariti', numItalia.guariti],
            ['Decessi', numItalia.decessi]
          ],
          type: 'donut',
          onclick: function(d, i) {
            console.log("onclick", d, i);
          },
          onmouseover: function(d, i) {
            console.log("onmouseover", d, i);
          },
          onmouseout: function(d, i) {
            console.log("onmouseout", d, i);
          }
        },
        color: {
          pattern: ['rgba(88,216,163,1)', 'rgba(4,189,254,0.6)', 'rgba(237,28,36,0.6)']
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 30,
          left: 0,
        },
        donut: {
          title: "Panoramica generale italia"
        }
      });

    })(jQuery);

})