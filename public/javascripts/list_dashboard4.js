
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {


    var idCompany = $('#idCompany').val();
    $('#idCompany').change(function () {
        idCompany = $(this).val();

        if (table.length > 0) {
            table.api().ajax.reload(null, true);
        }

    });

    var year = $(this).find('#year option:selected').val();
    var month = $(this).find('#month option:selected').val();

    $("#year").change(function () {
        year = $(this).val();

        if (table.length > 0) {
            table.api().ajax.reload(null, false);
        }

    });

    $("#month").change(function () {
        month = $(this).val();

        if (table.length > 0) {
            table.api().ajax.reload(null, false);
        }


    });

    //get DataTable table object
    var table = $("#listSAP2-container table").dataTable({
        "columnDefs": [
            {
                "targets": "amount_in",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": "amount_out",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            }
        ],
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-file-excel"></i> Export'
            },
            {
                text: '<i class="fas fa-sync-alt"></i>',
                action: function (e, dt, node, config) {
                    dt.ajax.reload(null, false);
                }
            }
        ],
        "destroy": true,
        "dom": "<'row table-toolbar'<'col-sm mr-auto content-title'><'col-sm ml-auto justify-content-end'fB>><'row'<'col-sm't>><'row'<'col-sm mr-auto'i><'col-sm ml-auto'p>>",
        "iDisplayLength": 12,
        "ordering": true,
        "order": [],
        "orderCellsTop": false,
        "fixedHeader": {
            header: true,
            footer: true
        },
        "paging": true,
        "select": {
            style: 'os'
        },
        "retrieve": true,
        "language": {
            "search": "",
            "emptyTable": "Nothing worth to be shown"
        },
        "initComplete": function (settings, json) {

            var api = this.api();
            var title = $(api.table().node()).data("title");
            $("div.content-title").text(title);
            $(".dataTables_filter input[type='search']").attr("placeholder", "Search");
        },
        "footerCallback": function (row, data, start, end, display) {

        },
        "ajax": {
            "url": "/dashboards/4/",
            "type": "GET",
            "data": function (d) {
                d.id = idCompany;
                d.month = month;
                d.year = year;
            }
        }

    });

    //update data
    setInterval(function () {
        table.api().ajax.reload(null, false);
    }, 60000);

});