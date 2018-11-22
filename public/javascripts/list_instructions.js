
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {

    var idCompany = $('#idCompany').val();
    $('#idCompany').change(function () {
        idCompany = $(this).val();

        if (table1.length > 0) {
            table1.api().ajax.reload(null, true);
        }

        if (table2.length > 0) {
            table2.api().ajax.reload(null, true);
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
                "targets": "status_bill",
                "render": function (data, type, row) {

                    switch (data) {
                        case 1:
                            return "<span class='badge badge-danger'>Not Invoiced</span>";
                        case 2:
                            return "<span class='badge badge-success'>Invoiced</span>";
                        case 3:
                            return "<span class='badge badge-warning'>Invoiced Late</span>";
                    }

                },
            },
            {
                "targets": "accept_st",
                "render": function (data, type, row) {
                    switch (data) {
                        case 2:
                            return "<span class='badge badge-danger'>Rejected</span>";
                        case 1:
                            return "<span class='badge badge-success'>Accepted</span>";
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
                            case 1:
                                return "<span class='badge badge-primary'>Paid</span>";
                            case 2:
                                return "<span class='badge badge-success'>Paid</span>";
                            case 3:
                                return "<span class='badge badge-warning'>Paid Late</span>";
                        }
                    } else if (row[9] === 3) {
                        switch (data) {
                            case 1:
                                return "<span class='badge badge-primary'>Paid Late</span>";
                            case 2:
                                return "<span class='badge badge-success'>Paid</span>";
                            case 3:
                                return "<span class='badge badge-warning'>Paid Late</span>";
                        }
                    } else {
                        switch (data) {
                            case 1:
                                return "<span class='badge badge-danger'>Not Paid</span>";
                            case 2:
                                return "<span class='badge badge-success'>Paid</span>";
                            case 3:
                                return "<span class='badge badge-warning'>Paid Late</span>";
                        }
                    }
                },
            },
            {
                "targets": "paid_ts",
                "render": function (data, type, row) {
                    if (data) {
                        return moment(data).format("YYYY-MM-DD");
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
                "targets": "status_bill",
                "render": function (data, type, row) {
                    if (row[9] === 2) {
                        switch (data) {
                            case 1:
                                return "<span class='badge badge-primary'>Invoiced</span>";
                            case 2:
                                return "<span class='badge badge-success'>Invoiced</span>";
                            case 3:
                                return "<span class='badge badge-warning'>Invoiced Late</span>";
                        }
                    } else if (row[9] === 3) {
                        switch (data) {
                            case 1:
                                return "<span class='badge badge-primary'>Invoiced Late</span>";
                            case 2:
                                return "<span class='badge badge-success'>Invoiced</span>";
                            case 3:
                                return "<span class='badge badge-warning'>Invoiced Late</span>";
                        }
                    } else {
                        switch (data) {
                            case 1:
                                return "<span class='badge badge-danger'>Not Invoiced</span>";
                            case 2:
                                return "<span class='badge badge-success'>Invoiced</span>";
                            case 3:
                                return "<span class='badge badge-warning'>Invoiced Late</span>";
                        }
                    }
                },
            },
            {
                "targets": "accept_st",
                "render": function (data, type, row) {
                    switch (data) {
                        case 2:
                            return "<span class='badge badge-danger'>Rejected</span>";
                        case 1:
                            return "<span class='badge badge-success'>Accepted</span>";
                        default:
                            return "";
                    }

                },
            },
            {
                "targets": "status_paid",
                "render": function (data, type, row) {
                    switch (data) {
                        case 1:
                            return "<span class='badge badge-danger'>Not Paid</span>";
                        case 2:
                            return "<span class='badge badge-success'>Paid</span>";
                        case 3:
                            return "<span class='badge badge-warning'>Paid Late</span>";
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
                    return data;
                }
            },
            {
                "targets": "type_dte",
                "render": function (data, type, row) {
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
            $('input[type="checkbox"]', rows).prop('checked', this.checked);

            /*for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.cells[6].textContent !== "Invoiced" && row.cells[6].textContent !== "Invoiced Late") {
                    $('input[type="checkbox"]', row).prop('checked', this.checked);
                }
            }*/

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

    var status_billed = 0;

    $('#setAsInvoiced').click(function () {
        var table = $('#listinstructionsD-container table').DataTable();

        var dte_status = [
            "Accepted",
            "Rejected"
        ]

        var dte_inv = [
            "Invoiced",
            "Invoiced Late"
        ]

        var dte_type = [];

        dte_type[0] = " "
        dte_type[30] = "Factura"
        dte_type[33] = "Factura Electronica"
        dte_type[61] = "Nota de Credito Electronica"
        dte_type[56] = "Nota de Debito Electronica"
        dte_type[60] = "Nota de Credito"
        dte_type[55] = "Nota de Debito"

        table.$("input[type='checkbox']:checked").each(function () {
            var row = this.parentElement.parentElement;
            var data = table.row(row).data();
            $('#listinstructionsD-container').addClass("editing");
            var $row = $(row);

            var thisInvoiced = $row.find("td:nth-child(7)");
            thisInvoiced.empty().append($("<select></select>", {
                "id": "inv_" + data[1],
                "class": "setInvoiced form-control",
                "width": "150"
            }).append(function () {
                var options = [];
                $.each(dte_inv, function (k, v) {
                    if (data[9] === (k + 2)) {
                        options.push($("<option></option>", {
                            "text": v,
                            "value": k,
                            "selected": true
                        }));
                    } else if (data[8] === (k + 2)) {
                        options.push($("<option></option>", {
                            "text": v,
                            "value": k,
                            "selected": true
                        }));
                    } else {
                        options.push($("<option></option>", {
                            "text": v,
                            "value": k
                        }));
                    }
                })
                return options;
            }));

            var thisFolio = $row.find("td:nth-child(9)");
            thisFolio.empty().append($("<input></input>", {
                "id": "folio_" + data[1],
                "class": "setFolioDTE form-control",
                "type": "text",
                "value": data[10],
                "width": "115"
            }));

            var thisType = $row.find("td:nth-child(10)");
            thisType.empty().append($("<select></select>", {
                "id": "type_" + data[1],
                "class": "setTypeDTE form-control",
                "width": "130"
            }).append(function () {
                var options = [];
                $.each(dte_type, function (k, v) {
                    if (v) {
                        if (k === data[11]) {
                            options.push($("<option></option>", {
                                "text": v,
                                "value": k,
                                "selected": true
                            }));
                        } else {
                            options.push($("<option></option>", {
                                "text": v,
                                "value": k
                            }));
                        }
                    }
                })
                return options;
            }));

            var thisStatusDTE = $row.find("td:nth-child(11)");
            thisStatusDTE.empty().append($("<select></select>", {
                "id": "type_" + data[1],
                "class": "setStatusDTE form-control",
                "width": "115"
            }).append(function () {
                var options = [];
                $.each(dte_status, function (k, v) {
                    options.push($("<option></option>", {
                        "text": v,
                        "value": k + 1
                    }))
                })
                return options;
            }));

            var saveFolio = document.getElementById('save');
            saveFolio.style.display = 'inline';
            var cancelFolio = document.getElementById('cancel');
            cancelFolio.style.display = 'inline';

            $('#cancel').click(function () {
                window.location = window.location;
            });

            $('#save').click(function () {
                var table = $('#listinstructionsD-container table').DataTable();

                $('#listinstructionsD-container').removeClass("editing");

                var list = [];
                table.$("input[type='checkbox']:checked").each(function () {
                    list.push(this.name);
                });

                var invoiced_st = [];
                var err = 0;

                table.$("select[class='setInvoiced form-control']").each(function () {
                    if (this.value) {
                        invoiced_st.push(parseInt(this.value) + 2);
                    } else {
                        err = 1;
                    }
                });

                if (err === 1) return alert("ERROR NO STATUS DTE INSERTED");

                var folio = [];
                var err = 0;

                table.$("input[class='setFolioDTE form-control']").each(function () {
                    if (this.value) {
                        folio.push(this.value);
                    } else {
                        err = 1;
                    }
                });

                if (err === 1) return alert("ERROR NO DTE NUMBER INSERTED");

                var type = [];
                var err = 0;

                table.$("select[class='setTypeDTE form-control']").each(function () {
                    if (this.value) {
                        type.push(this.value);
                    } else {
                        err = 1;
                    }
                });

                if (err === 1) return alert("ERROR NO TYPE DTE INSERTED");

                var accept_st = [];
                var err = 0;

                table.$("select[class='setStatusDTE form-control']").each(function () {
                    if (this.value) {
                        accept_st.push(this.value);
                    } else {
                        err = 1;
                    }
                });

                if (err === 1) return alert("ERROR NO STATUS DTE INSERTED");

                updateLogSetAsInvoiced();
                var intervalId = setInterval(updateLogSetAsInvoiced, 3000);

                $.post("/instructions/setAsInvoiced/", { list: list.join(","), invoiced_st: invoiced_st.join(","), folio: folio.join(","), type: type.join(","), accept_st: accept_st.join(","), idCompany: idCompany }, function (result) {

                    var close = document.getElementById('closeLog');
                    close.style.display = 'inline';

                    var loadingProcess = document.getElementById('loadingProcess');
                    loadingProcess.style.display = 'none';

                    if (table1.length > 0) {
                        table1.api().ajax.reload(null, false);
                    }

                    if (table2.length > 0) {
                        table2.api().ajax.reload(null, false);
                    }

                    $("#closeLog").click(function () {
                        clearTimeout(intervalId);
                        $("#process-log-container").remove();
                        var saveFolio = document.getElementById('save');
                        saveFolio.style.display = 'none';
                        var cancelFolio = document.getElementById('cancel');
                        cancelFolio.style.display = 'none';
                    });
                });

            });

        });
    });

    $('#setAsPaid').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();

        var pay_status = [
            "Not Paid",
            "Paid",
            "Paid Late"
        ]

        table.$("input[type='checkbox']:checked").each(function () {
            var row = this.parentElement.parentElement;
            var data = table.row(row).data();
            $('#listinstructionsC-container').addClass("editing");
            var $row = $(row);

            var thisPay = $row.find("td:nth-child(8)");
            thisPay.empty().append($("<select></select>", {
                "id": "pay_" + data[1],
                "class": "setPay form-control",
                "width": "115"
            }).append(function () {
                var options = [];
                $.each(pay_status, function (k, v) {
                    if (data[9] === (k + 1)) {
                        options.push($("<option></option>", {
                            "text": v,
                            "value": k,
                            "selected": true
                        }));
                    } else if (data[8] === (k + 1)) {
                        options.push($("<option></option>", {
                            "text": v,
                            "value": k,
                            "selected": true
                        }));
                    } else {
                        options.push($("<option></option>", {
                            "text": v,
                            "value": k
                        }));
                    }
                });

                return options;
            }));

            var thisPayDate = $row.find("td:nth-child(13)");
            thisPayDate.empty().append($("<input></input>", {
                "id": "payDate_" + data[1],
                "class": "setPayDate form-control",
                "width": "110",
                "value": new moment().format("YYYY-MM-DD")
            }));

            var savePaid = document.getElementById('save');
            savePaid.style.display = 'inline';
            var cancelPaid = document.getElementById('cancel');
            cancelPaid.style.display = 'inline';

            $('#cancel').click(function () {
                window.location = window.location;
            });

            $('#save').click(function () {
                var table = $('#listinstructionsC-container table').DataTable();

                $('#listinstructionsC-container').removeClass("editing");

                var list = [];
                table.$("input[type='checkbox']:checked").each(function () {
                    list.push(this.name);
                });

                var pay = [];
                var err = 0;

                table.$("select[class='setPay form-control']").each(function () {
                    if (this.value) {
                        pay.push(parseInt(this.value) + 1);
                    } else {
                        err = 1;
                    }
                });

                if (err === 1) return alert("ERROR NO SET PAY INSERTED");

                var payDate = [];
                var err = 0;

                table.$("input[class='setPayDate form-control']").each(function () {
                    if (this.value) {
                        payDate.push(this.value);
                    } else {
                        err = 1;
                    }
                });

                if (err === 1) return alert("ERROR NO DATE INSERTED");

                updateLogSetAsPaid();
                var intervalId = setInterval(updateLogSetAsPaid, 3000);

                $.post("/instructions/setAsPaid/", { list: list.join(","), pay: pay.join(","), payDate: payDate.join(","), idCompany: idCompany }, function (result) {

                    var close = document.getElementById('closeLog');
                    close.style.display = 'inline';

                    var loadingProcess = document.getElementById('loadingProcess');
                    loadingProcess.style.display = 'none';

                    if (table1.length > 0) {
                        table1.api().ajax.reload(null, false);
                    }

                    if (table2.length > 0) {
                        table2.api().ajax.reload(null, false);
                    }

                    $("#closeLog").click(function () {
                        clearTimeout(intervalId);
                        $("#process-log-container").remove();
                        var saveFolio = document.getElementById('save');
                        saveFolio.style.display = 'none';
                        var cancelFolio = document.getElementById('cancel');
                        cancelFolio.style.display = 'none';
                    });
                });

            });
        });
    });

    /*
    $('#setAsPaid').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });
    
        updateLogSetAsPaid();
        var intervalId = setInterval(updateLogSetAsPaid, 3000);
    
        $.post("/instructions/setAsPaid/", { list: list.join(","), status_paid: 2, idCompany: idCompany }, function (result) {
    
            var close = document.getElementById('closeLog');
            close.style.display = 'inline';
    
            var loadingProcess = document.getElementById('loadingProcess');
            loadingProcess.style.display = 'none';
    
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
    */
    $('#setAsPaidAtrasado').click(function () {
        var table = $('#listinstructionsC-container table').DataTable();
        var list = [];
        table.$("input[type='checkbox']:checked").each(function () {
            list.push(this.name);
        });

        updateLogSetAsPaid();
        var intervalId = setInterval(updateLogSetAsPaid, 3000);

        $.post("/instructions/setAsPaid/", { list: list.join(","), status_paid: 3, idCompany: idCompany }, function (result) {

            var close = document.getElementById('closeLog');
            close.style.display = 'inline';

            var loadingProcess = document.getElementById('loadingProcess');
            loadingProcess.style.display = 'none';

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

        updateLogCreation();
        var intervalId = setInterval(updateLogCreation, 3000);

        $.post("/instructions/createInvoice/", { list: list.join(","), idCompany: idCompany }, function (result) {

            var close = document.getElementById('closeLog');
            close.style.display = 'inline';

            var loadingProcess = document.getElementById('loadingProcess');
            loadingProcess.style.display = 'none';

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


});




/*
 
FUNCTIONS
 
*/



function updateLogCreation() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
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
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
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
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
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
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
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
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
    }

    $.post("/instructions/updateLog", { log: "setAsInvoiced" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};
