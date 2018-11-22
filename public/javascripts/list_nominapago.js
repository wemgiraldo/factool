
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {

    //get DataTable table object
    var table = $("#listnominaPago-container table").dataTable({
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
            },
            {
                "targets": 1,
                "visible": false,
                "searchable": false
            },
            {
                "targets": "procesoAmount",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": "procesoAmount_gross",
                "render": $.fn.dataTable.render.number('.', ',', 0, '$')
            },
            {
                "targets": 7,
                "visible": false,
                "searchable": false
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

    //update data
    setInterval(function () {
        //table.api().ajax.reload(null, false);
    }, 60000);


    // Handle click on "Select all" control
    $('#table-select-all').on('click', function () {
        var table = $('#listnominaPago-container table').DataTable();
        // Get all rows with search applied
        var rows = table.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $('#listnominaPago-container tbody').on('change', 'input[type="checkbox"]', function () {
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

    $('#createNominaPago').click(function () {
        var table = $('#listnominaPago-container table').DataTable();
        var list = "";
        var idCompany;

        table.$('input[type="checkbox"]').each(function () {
            var row = $(this.parentElement.parentElement);
            var data = table.row(row).data();
            idCompany = data[7];
            // If checkbox is checked
            if (this.checked) {
                if (list.length === 0) {
                    list = this.name;
                } else {
                    list = list + "," + this.name;
                }
            }
        });

        updateLogCreation();
        var intervalId = setInterval(updateLogCreation, 3000);

        var id = $("#listprocesoPago-container #id_proceso").text();

        $.post("/instructions/createNominaPago/", { list: list, id: id, idCompany: idCompany }, function (result) {

            var close = document.getElementById('closeLog');
            close.style.display = 'inline';

            var loadingProcess = document.getElementById('loadingProcess');
            loadingProcess.style.display = 'none';

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
                window.location = window.location;
            });

            var link = document.createElement("a");
            link.setAttribute('href', "/download/?path=" + result.path + result.filename);
            link.setAttribute('download', result.filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        });
    });



    $('#closeNominaPago').click(function () {

        var closed_at = prompt("Please enter the close date:", moment().format("YYYY-MM-DD"));
        if (!closed_at) return alert("insert a valid date");
        var notes = prompt("Please enter your notes", "");

        var idCompany;
        var id = $("#listprocesoPago-container #id_proceso").text();
        var table = $('#listnominaPago-container table').DataTable();
        var list = "";

        table.$('input[type="checkbox"]').each(function () {
            var row = $(this.parentElement.parentElement);
            var data = table.row(row).data();
            idCompany = data[7];

            if (list.length === 0) {
                list = this.name;
            } else {
                list = list + "," + this.name;
            }

        });

        updateLogClosing();
        var intervalId = setInterval(updateLogClosing, 3000);

        $.post("/instructions/closeNominaPago/", { id: id, closed_at: closed_at, notes: notes, list: list, idCompany: idCompany }, function (result) {

            var close = document.getElementById('closeLog');
            close.style.display = 'inline';

            var loadingProcess = document.getElementById('loadingProcess');
            loadingProcess.style.display = 'none';

            $("#closeLog").click(function () {
                clearTimeout(intervalId);
                $("#process-log-container").remove();
                window.location = window.location;
            });

        });
    });



    $('#listprocesoPagos-container table tbody').on('click', 'tr', function () {

        var id = $(this).find("td").eq(0).text();

        window.location.href = "/instructions/showProcesoPago/" + id;

    });


});


function updateLogCreation() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
    }

    $.post("/instructions/updateLogPago", { log: "creation" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};

function updateLogClosing() {

    var logContainer = $("#process-log-container");

    if (logContainer.length === 0) {
        logContainer = $("<div id='process-log-container'><div id='log'><h3> Process log <i class='fas fa-sync-alt fa-spin fa-1x fa-fw' id='loadingProcess'></i> <i class='fa fa-times fa-lg' id='closeLog' aria-hidden='true' style='display: none'></i> </h3> </div></div>").appendTo("body");
    }

    $.post("/instructions/updateLogPago", { log: "closing" }, function (result) {
        if (result.length > 0) {
            var t = new Date();
            logContainer.find("#log").append("<p>" + t.toLocaleString() + ": " + result + "</p>")
        }
    });

};