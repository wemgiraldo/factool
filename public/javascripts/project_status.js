
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {

    //get DataTable table object
    var table = $("#listprjact-container table").dataTable({
        "columnDefs": [
            {
                "targets": "prj-Status", "render": function (data, type, row) {
                    switch (data) {
                        case "open":
                            return "<span class='badge badge-success'>Open</span>";
                        case "in progress":
                            return "<span class='badge badge-warning'>In Progress</span>";
                        case "closed":
                            return "<span class='badge badge-danger'>Closed</span>";
                        default:
                            return "<span>NO STATUS</span>";
                    }
                }
            }
        ],
        "buttons": [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
        "destroy": true,
        "dom": "<'row table-toolbar'<'col-sm mr-auto content-title'><'col-sm ml-auto justify-content-end'fB>><'row'<'col-sm't>><'row'<'col-sm-3 ml-auto'>>",
        "fixedHeader": {
            header: true,
            footer: true
        },
        "iDisplayLength": 5,
        "pagingType": "full_numbers",
        "order": [[0, "asc"]],
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
        "ajax": "/projects/active"

    });

    //get DataTable table object
    var table2 = $("#listprjall-container table").dataTable({
        "columnDefs": [
            {
                "targets": "prj-Status", "render": function (data, type, row) {
                    switch (data) {
                        case "open":
                            return "<span class='badge badge-success'>Open</span>";
                        case "in progress":
                            return "<span class='badge badge-warning'>In Progress</span>";
                        case "closed":
                            return "<span class='badge badge-danger'>Closed</span>";
                        default:
                            return "<span>NO STATUS</span>";
                    }
                }
            }
        ],
        "buttons": [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
        "destroy": true,
        "dom": "<'row table-toolbar'<'col-sm mr-auto content-title'><'col-sm ml-auto justify-content-end'fB>><'row'<'col-sm't>><'row'<'col-sm-3 ml-auto'>>",
        "fixedHeader": {
            header: true,
            footer: true
        },
        "order": [[0, "asc"]],
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
        "ajax": "/projects/all"

    });

    //update data
    setInterval(function () {
        if (table) {
            table.api().ajax.reload(null, false);
        }

        if (table2) {
            table2.api().ajax.reload(null, false);
        }

    }, 10000);

    $('#listprjact-container table tbody').on('click', 'tr', function () {

        var id = $(this).find("td").eq(0).text();

        window.location.href = "/projects/one/" + id;

    });

});