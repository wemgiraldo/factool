
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {

    var idCompany = $('#idCompany').val();
    $('#idCompany').change(function () {
        idCompany = $(this).val();

        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
        }
    });

    var year = $(this).find('#year option:selected').val();
    var month = $(this).find('#month option:selected').val();

    $("#year").change(function () {
        year = $(this).val();

        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
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
                "targets": "accept_st",
                "render": function (data, type, row) {
                    switch (data) {
                        case "Rechazado":
                            return "<span class='badge badge-danger'>Rechazado</span>";
                        case "Aceptado":
                            return "<span class='badge badge-success'>Aceptado</span>";
                        default:
                            return "";
                    }
                },
            },
            {
                "targets": "status_paid",
                "render": function (data, type, row) {
                    if (row[9] === 2) {
                        switch (data) {
                            case "No Pagado":
                                return "<span class='badge badge-primary'>Pagado</span>";
                            case "Pagado":
                                return "<span class='badge badge-success'>Pagado</span>";
                            case "Pagado con Atraso":
                                return "<span class='badge badge-warning'>Pagado con Atraso</span>";
                        }
                    } else if (row[9] === 3) {
                        switch (data) {
                            case "No Pagado":
                                return "<span class='badge badge-primary'>Pagado con Atraso</span>";
                            case "Pagado":
                                return "<span class='badge badge-success'>Pagado</span>";
                            case "Pagado con Atraso":
                                return "<span class='badge badge-warning'>Pagado con Atraso</span>";
                        }
                    } else {
                        switch (data) {
                            case "No Pagado":
                                return "<span class='badge badge-danger'>No Pagado</span>";
                            case "Pagado":
                                return "<span class='badge badge-success'>Pagado</span>";
                            case "Pagado con Atraso":
                                return "<span class='badge badge-warning'>Pagado con Atraso</span>";
                        }
                    }
                },
            },
            {
                "targets": "paid_ts",
                "render": function (data, type, row) {
                    if (data) {
                        return moment(data).format("YYYY-MM-DD hh:mm");
                    } else {
                        return "";
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
            },
            {
                "targets": "status_paid2",
                "visible": false,
                "searchable": false
            },
            {
                "targets": "urlDTE",
                "visible": false,
                "searchable": false
            },
            {
                "targets": "folio",
                "render": function (data, type, row) {
                    return "<a href=" + row[12] + ">" + data + "</a>";
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
        "iDisplayLength": 10,
        "ordering": true,
        "order": [/*[7, "desc"]*/],
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
            "url": "/instructions/creditor/",
            "type": "GET",
            "data": function (d) {
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
                "targets": "accept_st",
                "render": function (data, type, row) {
                    switch (data) {
                        case "Rechazado":
                            return "<span class='badge badge-danger'>Rechazado</span>";
                        case "Aceptado":
                            return "<span class='badge badge-success'>Aceptado</span>";
                        default:
                            return "";
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
                "targets": "debtor",
                "visible": false,
                "searchable": false
            },
            {
                "targets": "status_bill2",
                "visible": false,
                "searchable": false
            },
            {
                "targets": "urlDTE",
                "visible": false,
                "searchable": false
            },
            {
                "targets": "folio",
                "render": function (data, type, row) {
                    return "<a href=" + row[13] + ">" + data + "</a>";
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
            "url": "/instructions/debtor/",
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
        if (table1.length > 0) {
            table1.api().ajax.reload(null, false);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, false);
        }
    }, 60000);

    // Handle click on "Select all" control
    $('#table-select-all').on('click', function () {

        var table1 = $('#listinstructionsC-container table').DataTable();
        var table2 = $('#listinstructionsD-container table').DataTable();

        if (table1.context.length > 0) {
            // Get all rows
            var rows = table1.rows({ 'search': 'applied' }).nodes();
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.cells[6].textContent !== "Facturado" && row.cells[6].textContent !== "Facturado con Atraso") {
                    $('input[type="checkbox"]', row).prop('checked', this.checked);
                }
            }

        } else {
            // Get all rows with search applied
            var rows = table2.rows({ 'search': 'applied' }).nodes();
            // Check/uncheck checkboxes for all rows in the table
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        }

    });

    $('#listinstructionsD-container tbody').on('change', 'input[type="checkbox"]', function () {
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

    $('#setAsInvoiced').click(function () {
        var table = $('#listinstructionsD-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        updateLogSetAsInvoiced();
        var intervalId = setInterval(updateLogSetAsInvoiced, 1000);

        $.post("/instructions/setAsInvoiced/", { list: list.join(","), status_billed: 2 }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");

            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });
        });
    });

    $('#setAsInvoicedDelaye').click(function () {
        var table = $('#listinstructionsD-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        updateLogSetAsInvoiced();
        var intervalId = setInterval(updateLogSetAsInvoiced, 100);

        $.post("/instructions/setAsInvoiced/", { list: list.join(","), status_billed: 3 }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");

            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });
        });
    });

    $('#setAsPaid').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        updateLogSetAsPaid();
        var intervalId = setInterval(updateLogSetAsPaid, 100);

        $.post("/instructions/setAsPaid/", { list: list.join(","), status_paid: 2 }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");

            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });
        });
    });

    $('#setAsPaidAtrasado').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        updateLogSetAsPaid();
        var intervalId = setInterval(updateLogSetAsPaid, 100);

        $.post("/instructions/setAsPaid/", { list: list.join(","), status_paid: 3 }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");

            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });
        });
    });

    $('#createInvoice').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        var loading = document.getElementById('onCreateInvoice');
        loading.style.visibility = 'visible';

        updateLogCreation();
        var intervalId = setInterval(updateLogCreation, 100);

        $.post("/instructions/createInvoice/", { list: list.join(",") }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");

            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });


            loading.style.visibility = 'hidden';
        });
    });


    $('#setAsAccepted').click(function () {
        var table = $('#listinstructionsD-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        var loading = document.getElementById('onAcceptRejectInvoice');
        loading.style.visibility = 'visible';

        updateLogAcceptance();
        var intervalId = setInterval(updateLogAcceptance, 100);

        $.post("/instructions/acceptInvoice/", { list: list.join(",") }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");


            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });

            loading.style.visibility = 'hidden';
        });
    });

    $('#setAsRejected').click(function () {
        var table = $('#listinstructionsD-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        var loading = document.getElementById('onAcceptRejectInvoice');
        loading.style.visibility = 'visible';

        updateLogRejection();
        var intervalId = setInterval(updateLogRejection, 100);

        $.post("/instructions/rejectInvoice/", { list: list.join(",") }, function (result) {

            $("#log").append("<button class='btn btn-backend m-3' id='closeLog'>Close</button>");


            if (table1.length > 0) {
                table1.api().ajax.reload(null, false);
            }

            if (table2.length > 0) {
                table2.api().ajax.reload(null, false);
            }

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
            });

            loading.style.visibility = 'hidden';
        });
    });

});

function updateLogCreation() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'> <div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw'></i> </h3></div></div>").appendTo("body");
    }

    $.post("/instructions/updateLog", { log: "creation" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};

function updateLogRejection() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'> <div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw'></i> </h3></div></div>").appendTo("body");
    }

    $.post("/instructions/updateLog", { log: "rejection" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};

function updateLogAcceptance() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'> <div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw'></i> </h3></div></div>").appendTo("body");
    }

    $.post("/instructions/updateLog", { log: "acceptance" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};

function updateLogSetAsPaid() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'> <div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw'></i> </h3></div></div>").appendTo("body");
    }

    $.post("/instructions/updateLog", { log: "setAsPaid" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};

function updateLogSetAsInvoiced() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'> <div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw'></i> </h3></div></div>").appendTo("body");
    }

    $.post("/instructions/updateLog", { log: "setAsInvoiced" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};
