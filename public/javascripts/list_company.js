
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {
   
    //get DataTable table object
    var table = $("#listcompany-container table").dataTable({
        "columnDefs": [
            {
                "targets": "rut",
                "render": function (data, type, row) {
                    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + row[3];
                }
            },
            {
                "targets": "verification_code",
                "visible": false,
                "searchable": false
            },
            {
                "targets": "comm_business",
                "render": function (data, type, row) {
                    if (data && data.length > 30) {
                        return "<span class='d-block' data-toggle='tooltip' data-placement='top' title='" + data + "'>" + data.substring(0, 30) + " .. </span>"
                    }
                    return data;
                }
            },
            {
                "targets": "comm_address",
                "render": function (data, type, row) {
                    if (data && data.length > 30) {
                        return "<span class='d-block' data-toggle='tooltip' data-placement='top' title='" + data + "'>" + data.substring(0, 30) + " .. </span>"
                    }
                    return data;
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
        "ajax": "/company/list"

    });

    //update data
    setInterval(function () {
        table.api().ajax.reload(null, false);
    }, 60000);

    $('#listcompany-container table tbody').on('click', 'tr', function () {

        var id = $(this).find("td").eq(0).text();

        window.location.href = "/company/show/" + id;

    });


});