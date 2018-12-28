var d;
var from;
var to;
var year;
var idCompany;

$(function () {

    idCompany = $('#idCompany').val();
    $('#idCompany').change(function () {
        idCompany = $(this).val();

        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
        }
    });

    var chartType1 = $(this).find('#chartType1 option:selected').val();
    setTimeBySelection(chartType1);

    $("#chartType1").change(function () {
        chartType1 = $("#chartType1 option:selected").val();
        setTimeBySelection(chartType1);
        GetDataEnergy();
    });

    GetDataEnergy();
    GetDataMoney();
});

function GetDataEnergy() {
    $.get("/dashboards/getDataEnergy/", { from: from, to: to }, function (result) {

        Highcharts.setOptions({
            time: {
                timezoneOffset: 1 * 60
            }
        });

        Highcharts.theme = {
            colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#1f2d30'],
                        [1, '#1f2d30']
                    ]
                },
                style: {
                    fontFamily: '\'Unica One\', sans-serif'
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },

            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },

            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)'
        };

        Highcharts.setOptions(Highcharts.theme);

        Highcharts.chart('container', {
            chart: {
                type: 'areaspline',
                height: 600,
                zoomType: 'x'
            },
            title: {
                text: 'PLANTs ENERGY'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:,.0f}</b>'
            },
            plotOptions: {
                series: {
                    pointStart: Date.UTC(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0),
                    pointInterval: 3600 * 1000, // 15 min
                    type: 'areaspline',
                    connectNulls: true
                }
            },
            series: result
        });

    });
}


function GetDataMoney() {
    $.get("/dashboards/getDataMoney/", { year: year, idCompany: idCompany }, function (result) {


        Highcharts.theme = {
            colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#1f2d30'],
                        [1, '#1f2d30']
                    ]
                },
                style: {
                    fontFamily: '\'Unica One\', sans-serif'
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },

            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },

            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)'
        };

        Highcharts.setOptions(Highcharts.theme);

        Highcharts.chart('container2', {
            chart: {
                type: 'column',
                height: 600
            },
            title: {
                text: 'SALES vs PURCHASES'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'Venta'
                }
            },
            {
                min: 0,
                title: {
                    text: 'Compra'
                },
                opposite: true
            }],
            tooltip: {
                headerFormat: '<span style="font-size:15px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} $</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }
            },
            series: [
                {
                    name: 'Peralillo Venta',
                    data: result[0].venta
                },
                {
                    name: 'Villa Prat Venta',
                    data: result[1].venta
                },
                {
                    name: 'Alto Solar Venta',
                    data: result[2].venta
                },
                {
                    name: 'El Queule Venta',
                    data: result[3].venta
                },
                {
                    name: 'Peralillo Compra',
                    data: result[0].compra,
                    yAxis: 1
                },
                {
                    name: 'Villa Prat Compra',
                    data: result[1].compra,
                    yAxis: 1
                },
                {
                    name: 'Alto Solar Compra',
                    data: result[2].compra,
                    yAxis: 1
                },
                {
                    name: 'El Queule Compra',
                    data: result[3].compra,
                    yAxis: 1
                }
            ]
        });

    });
}

function setTimeBySelection(type) {

    switch (type) {
        case "1 Week":
            d = new Date();
            from = moment([d.getFullYear(), d.getMonth(), d.getDate()]).add("-7", "d").toDate();
            to = d;
            year = d.getFullYear();
            break;
        case "1 Month":
            d = new Date();
            from = new Date(d.getFullYear(), d.getMonth(), 1);
            to = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            year = d.getFullYear();
            break;
        case "3 Months":
            d = new Date();
            from = new Date(d.getFullYear(), d.getMonth() - 2, 1);
            to = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            year = d.getFullYear();
            break;
        case "1 Year":
            d = new Date();
            from = new Date(d.getFullYear(), 0, 1);
            to = new Date(d.getFullYear(), 11, 0);
            year = d.getFullYear();
            break;
        case "test":
            d = new Date();
            from = new Date(2018, 10, 4);
            to = new Date(2018, 10, 4, 23, 59);
            year = d.getFullYear();
            break;
    }
}

