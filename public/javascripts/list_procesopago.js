
'use strict';

/*----------------------------------------
    Document Ready 
----------------------------------------*/
$(document).ready(function () {
    
    var idCompany = $('#idCompany').val();
	$('#idCompany').change(function () {
		idCompany = $(this).val();
    });

    //get DataTable table object
    var table = $("#listprocesoPago-container table").dataTable({
        "columnDefs": [

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
            "type": "GET"
        }

    });

    //update data
    setInterval(function () {
        table.api().ajax.reload(null, false);
    }, 60000);

    $('#createProcesoPago').click(function () {
        
        var bankaccount = prompt("Please enter your bank account", "");
        if (!bankaccount ) return alert("insert a valid bank account");
        var notes = prompt("Please enter your notes", "");

        $.post("/instructions/createProcesoPago/", { bank_account: bankaccount, notes: notes }, function (result) {
            return alert(result);
        });
    });

    $('#listprocesoPago-container table tbody').on('click', 'tr', function () {

        var id = $(this).find("td").eq(0).text();

        window.location.href = "/instructions/showProcesoPago/" + id + "/" + idCompany;

    });


});