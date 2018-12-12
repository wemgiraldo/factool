
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {

    //get DataTable table object
    var table = $("#listCheckPaid-container table").dataTable({
        "columnDefs": [
            {
                "targets": 0,
                "searchable": false,
                "orderable": false,
                'className': 'dt-body-center',
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" name=' + full[1] + ' value="'
                        + $('<div/>').text(data).html() + '">';
                }
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
        "iDisplayLength": 4,
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
            "emptyTable": "Nothing worth to be shown",
            "thousands": ","
        },
        "initComplete": function (settings, json) {

            var api = this.api();
            var title = $(api.table().node()).data("title");
            $("div.content-title").text(title);
            $(".dataTables_filter input[type='search']").attr("placeholder", "Search");
        },
        "footerCallback": function (row, data, start, end, display) {

        }

    });

});
