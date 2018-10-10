
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
                "targets": "is_paid",
                "render": function (data, type, row) {
                    if (data === "1") {
                        return "<span class='badge badge-success'>Pagado</span>";
                    }
                    return "<span class='badge badge-danger'>No Pagado</span>";
                },
            },
            {
                "targets": "status_bill",
                "render": function (data, type, row) {
                    switch (data) {
                        case "No Facturado":
                            return "<span class='badge badge-danger'>No Facturado</span>";
                        case "Facturado":
                            return "<span class='badge badge-success'>Facturado</span>";
                        case "Facturado con Atraso":
                            return "<span class='badge badge-warning'>Facturado con Atraso</span>";
                    }
                },
            },
            {
                "targets": "status_paid",
                "render": function (data, type, row) {
                    switch (data) {
                        case "No Pagado":
                            return "<span class='badge badge-danger'>No Pagado</span>";
                        case "Pagado":
                            return "<span class='badge badge-success'>Pagado</span>";
                        case "Pagado con Atraso":
                            return "<span class='badge badge-warning'>Pagado con Atraso</span>";
                    }
                },
            },
            {
                "targets": 0,
                "searchable": false,
                "orderable": false,
                'className': 'dt-body-center',
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" name=' + full[1] + ' value="'
                        + $('<div/>').text(data).html() + '">';
                }
            },
            {
                "targets": "amount",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": "amount_gross",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": "creditor",
                "visible": false,
                "searchable": false
            }
        ],
        buttons: [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
        "destroy": true,
        "dom": "<'row table-toolbar'<'col-sm mr-auto content-title'><'col-sm ml-auto justify-content-end'fB>><'row'<'col-sm't>><'row'<'col-sm mr-auto'i><'col-sm ml-auto'p>>",
        "iDisplayLength": 10,
        "ordering": true,
        "order": [[7, "desc"]],
        "orderCellsTop": false,
        "fixedHeader": {
            header: true,
            footer: true
        },
        "paging": true,
        "select": {
            style: 'os',
            selector: 'td:first-child'
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
                "targets": "is_paid",
                "render": function (data, type, row) {
                    if (data === "1") {
                        return "<span class='badge badge-success'>Pagado</span>";
                    }
                    return "<span class='badge badge-danger'>No Pagado</span>";
                },
            },
            {
                "targets": 0,
                "searchable": false,
                "orderable": false,
                'className': 'dt-body-center',
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" name=' + full[1] + ' value="'
                        + $('<div/>').text(data).html() + '">';
                }
            },
            {
                "targets": "amount",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": "amount_gross",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": "debtor",
                "visible": false,
                "searchable": false
            }
        ],
        buttons: [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
        "destroy": true,
        "dom": "<'row table-toolbar'<'col-sm mr-auto content-title'><'col-sm ml-auto justify-content-end'fB>><'row'<'col-sm't>><'row'<'col-sm mr-auto'i><'col-sm ml-auto'p>>",
        "iDisplayLength": 10,
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
                "targets": "rut",
                "render": function (data, type, row) {
                    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + row[3];
                }
            },
            {
                "targets": "verification_code",
                "visible": false,
                "searchable": false
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

    // Handle click on "Select all" control
    $('#table-select-all').on('click', function () {

        var table = $('#listinstructionsC-container table').DataTable();
        // Get all rows with search applied
        var rows = table.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });


    // Handle click on checkbox to set state of "Select all" control
    $('#listinstructionsC-container tbody').on('change', 'input[type="checkbox"]', function () {
        // If checkbox is not checked
        if (!this.checked) {
            var el = $('#example-select-all').get(0);
            // If "Select all" control is checked and has 'indeterminate' property
            if (el && el.checked && ('indeterminate' in el)) {
                // Set visual state of "Select all" control
                // as 'indeterminate'
                el.indeterminate = true;
            }
        }
    });

    $('#createInvoice').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();
        var list = "";
        table.$('input[type="checkbox"]').each(function () {
            // If checkbox is checked
            if (this.checked) {
                if (list.length === 0) {
                    list = this.name;
                } else {
                    list = list + "," + this.name;
                }
            }
        });

        $.post("/instructions/createInvoice/list", { list: list }, function (err) {
            if (err) {
                alert('cmd error');
            }
        });
    });

});