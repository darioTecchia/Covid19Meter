/**
 * Riposta del DB: Ultimi 10 dati regionali.
 * Per ricevere i dati di una precisa regione
 * puoi passare parametri come codice_regione
 * o denominazione_regione.
 * Esempio di oggetto nella risposta
 * {
        "data": "2020-02-24T18:00:00",
        "stato": "ITA",
        "codice_regione": 13,
        "denominazione_regione": "Abruzzo",
        "lat": 42.35122196,
        "long": 13.39843823,
        "ricoverati_con_sintomi": 0,
        "terapia_intensiva": 0,
        "totale_ospedalizzati": 0,
        "isolamento_domiciliare": 0,
        "totale_positivi": 0,
        "variazione_totale_positivi": 0,
        "nuovi_positivi": 0,
        "dimessi_guariti": 0,
        "deceduti": 0,
        "totale_casi": 0,
        "tamponi": 5,
        "casi_testati": null,
        "note_it": "",
        "note_en": ""
    },
 * 
 */
$(document).ready(function () {
    let help = $('#recapRegione')
    $.ajax({
        type: "GET",
        url: "/api/regional_data?denominazione_regione=Abbruzzo",
        data: null,
        success: function (done) {
            let i = 0;
            while (i < done.length) {
                help.html("<tr>\n" +
                    "<td>" + done[i].denominazione_regione + "</td>\n" +
                    "<td>" + done[i].totale_positivi + "</td>\n" +
                    "<td>" + done[i].tamponi + "</td>\n" +
                    "<td>" + done[i].dimessi_guariti + "</td>\n" +
                    "<td>" + done[i].deceduti + "</td>\n" +
                    "<td>" + done[i].data + "</td>\n" +
                    "</tr>\n")
            }
        }
    })

    /**
     * Riposta del DB: Ultimi 10 dati provinciali.
     * Per ricevere i dati di una precisa provincia
     * puoi passare parametri come codice_provincia
     * o denominazione_provincia.
     * Esempio di oggetto nella risposta
     * {
            "data": "2020-02-24T18:00:00",
            "stato": "ITA",
            "codice_regione": 13,
            "denominazione_regione": "Abruzzo",
            "codice_provincia": 69,
            "denominazione_provincia": "Chieti",
            "sigla_provincia": "CH",
            "lat": 42.35103167,
            "long": 14.16754574,
            "totale_casi": 0,
            "note_it": "",
            "note_en": ""
        },
     * 
     */
    let help2 = $('#recapProvincia')
    $.ajax({
        type: "GET",
        url: "/api/provincial_data?denominazione_provincia=Chieti",
        data: null,
        success: function (done) {
            let i = 0;
            while (i < done.length) {
                help.html("<tr>\n" +
                    "<td>" + done[i].denominazione_provincia + "</td>\n" +
                    "<td>" + done[i].totale_casi + "</td>\n" +
                    "<td>" + done[i].data + "</td>\n" +
                    "</tr>\n")
            }
        }
    })

})

/**
 * Riposta del DB: Ultimi 10 dati regionali.
 * Per ricevere i dati di una precisa regione
 * puoi passare parametri come codice_regione
 * o denominazione_regione.
 * Esempio di oggetto nella risposta
 * {
        "data": "2020-02-24T18:00:00",
        "stato": "ITA",
        "codice_regione": 13,
        "denominazione_regione": "Abruzzo",
        "lat": 42.35122196,
        "long": 13.39843823,
        "ricoverati_con_sintomi": 0,
        "terapia_intensiva": 0,
        "totale_ospedalizzati": 0,
        "isolamento_domiciliare": 0,
        "totale_positivi": 0,
        "variazione_totale_positivi": 0,
        "nuovi_positivi": 0,
        "dimessi_guariti": 0,
        "deceduti": 0,
        "totale_casi": 0,
        "tamponi": 5,
        "casi_testati": null,
        "note_it": "",
        "note_en": ""
    },
 * 
 */
function getRegion(regione) {
    $.ajax({
        type: "GET",
        url: "/confronto/buildGraph",
        data: regione,
        success: function (done) {
            let i = 0;
            while (i < done.length) {
                help.html("<tr>\n" +
                    "<td>" + done[i].nomeProvincia + "</td>\n" +
                    "<td>" + done[i].totCasi + "</td>\n" +
                    "<td>" + done[i].data + "</td>\n" +
                    "</tr>\n")
            }
        }
    })
    var chart = AmCharts.makeChart("line_chart", {
        "type": "serial",
        "theme": "light",
        "dataDateFormat": "YYYY-MM-DD",
        "precision": 2,
        "valueAxes": [{
            "id": "v1",
            "position": "left",
            "autoGridCount": false,
            "labelFunction": function (value) {
                return "$" + Math.round(value) + "M";
            }
        }, {
            "id": "v2",
            "gridAlpha": 0,
            "autoGridCount": false
        }],
        "graphs": [{
            "id": "g1",
            "valueAxis": "v2",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 8,
            "hideBulletsCount": 50,
            "lineThickness": 3,
            "lineColor": "#2ed8b6",
            "title": "Guariti",
            "useLineColorForBulletBorder": true,
            "valueField": "market1",
            "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]]</b>"
        }, {
            "id": "g2",
            "valueAxis": "v2",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 8,
            "hideBulletsCount": 50,
            "lineThickness": 3,
            "lineColor": "#e95753",
            "title": "Deceduti",
            "useLineColorForBulletBorder": true,
            "valueField": "market2",
            "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]]</b>"
        }],
        "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha": 0,
            "valueLineAlpha": 0.2
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "legend": {
            "useGraphSettings": true,
            "position": "top"
        },
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
        },
        "dataProvider": [{
            "date": "2013-01-16",
            "market1": 71,
            "market2": 75
        }, {
            "date": "2013-01-17",
            "market1": 80,
            "market2": 84
        }, {
            "date": "2013-01-18",
            "market1": 78,
            "market2": 83
        }, {
            "date": "2013-01-19",
            "market1": 85,
            "market2": 88
        }, {
            "date": "2013-01-20",
            "market1": 87,
            "market2": 85
        }, {
            "date": "2013-01-21",
            "market1": 97,
            "market2": 88
        }, {
            "date": "2013-01-22",
            "market1": 93,
            "market2": 88
        }, {
            "date": "2013-01-23",
            "market1": 85,
            "market2": 80
        }, {
            "date": "2013-01-24",
            "market1": 90,
            "market2": 85
        }]
    });
}