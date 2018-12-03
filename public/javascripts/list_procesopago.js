
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

    //get DataTable table object
    var table = $("#listprocesoPago-container table").dataTable({
        "columnDefs": [
            {
                "targets": "created_at",
                "render": function (data, type, row) {
                    if (data) {
                        return moment(data).format("YYYY-MM-DD hh:mm:ss");
                    } else {
                        return "";
                    }
                },
            },
            {
                "targets": "closed_at",
                "render": function (data, type, row) {
                    if (data) {
                        return moment(data).format("YYYY-MM-DD hh:mm:ss");
                    } else {
                        return "";
                    }
                },
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
            "url": "/instructions/listProcesoPago/",
            "type": "GET",
            "data": function (d) {
                d.id = idCompany;
            }
        }
    });

    //update data
    setInterval(function () {
        table.api().ajax.reload(null, false);
    }, 60000);

    $('#createProcesoPago').click(function () {

        var bankaccount = prompt("Please enter your bank account", "");
        if (!bankaccount) return alert("insert a valid bank account");
        var notes = prompt("Please enter your notes", "");

        $.post("/instructions/createProcesoPago/", { bank_account: bankaccount, notes: notes, idCompany: idCompany }, function (result) {
            table.api().ajax.reload(null, false);
            return alert(result);
        });

        /*
        $.get("/instructions/getBankAccount/", { idCompany: idCompany }, function (result) {
            var bank_acc_sel = document.getElementById('bank_acc_proc');
            $.each(result, function (k, v) {
                var opt = document.createElement('option');
                opt.text = v.account_number;
                opt.value = k;
                bank_acc_sel.appendChild(opt);
            })
        });


            bankaccount = $('#bank_acc_proc selected').val();
            notes =$('#notes_proc').val();
            $.post("/instructions/createProcesoPago/", { bank_account: bankaccount, notes: notes, idCompany: idCompany }, function (result) {
                table.api().ajax.reload(null, false);
                return alert(result);
            });
        });
*/
    });

    $('#listprocesoPago-container table tbody').on('click', 'tr', function () {

        var id = $(this).find("td").eq(0).text();

        window.location.href = "/instructions/showProcesoPago/" + id + "/" + idCompany;

    });


});