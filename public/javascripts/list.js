
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {

    var idCompany = $(this).find('#idCompany option:selected').val();
    var year = $(this).find('#year option:selected').val();
    var month = $(this).find('#month option:selected').val();

    $("#idCompany").change(function () {
        idCompany = $(this).val();
    });

    $("#year").change(function () {
        year = $(this).val();

        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
        }

        if (table3.length > 0) {
            table3.api().ajax.reload(null, false);
        }
    });

    $("#month").change(function () {
        month = $(this).val();

        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
        }

        if (table3.length > 0) {
            table3.api().ajax.reload(null, false);
        }
    });

    //get DataTable table object
    var table1 = $("#listinstructionsC-container table").dataTable({
        "columnDefs": [
            {
                "targets": "is_paid", "render": function (data, type, row) {
                    if (data === "1") {
                        return "<span class='badge badge-success'>Pagado</span>";
                    }
                    return "<span class='badge badge-danger'>No Pagado</span>";
                }
            }
        ],
        buttons: [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
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
            "url": "/instructions/list/",
            "type": "GET",
            "data": function (d) {
                d.type = "creditor";
                d.id = idCompany;
                d.month = month;
                d.year = year;
            }
        }
    });

    //get DataTable table object
    var table2 = $("#listinstructionsD-container table").dataTable({
        "columnDefs": [
            {
                "targets": "is_paid", "render": function (data, type, row) {
                    if (data === "1") {
                        return "<span class='badge badge-success'>Pagado</span>";
                    }
                    return "<span class='badge badge-danger'>No Pagado</span>";
                }
            }
        ],
        buttons: [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
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
            "url": "/instructions/list/",
            "type": "GET",
            "data": function (d) {
                d.type = "debtor";
                d.id = idCompany;
                d.month = month;
                d.year = year;
            }
        }

    });

    //get DataTable table object
    var table3 = $("#listcompany-container table").dataTable({
        "columnDefs": [
            {
            }
        ],
        buttons: [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
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

    if (table1.length > 0) {
        table1.api().ajax.reload(null, false);
    }

    if (table2.length > 0) {
        table2.api().ajax.reload(null, false);
    }

    if (table3.length > 0) {
        table3.api().ajax.reload(null, false);
    }

    //update data
    setInterval(function () {
        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
        }

        if (table3.length > 0) {
            table3.api().ajax.reload(null, false);
        }
    }, 100000);

    $('#listingresos-container table tbody').on('click', 'tr', function () {

        var data = $(this).find("td").eq(0).text();
        var id = $(this).find("td").eq(0).text();

        window.location.href = "/ingresos/show/" + id;

    });


});