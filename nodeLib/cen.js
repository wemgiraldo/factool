var request = require('request');
var models = require('../models');

class CEN {

    constructor(config) {

        this.endpoint = "https://ppagos-sen.coordinadorelectrico.cl";
        this.endpointTest = "https://staging-ppagos-sen.coordinadorelectrico.cl";
        this.config = config;

        //attivo funzione di refresh dei dati ogni X minuti
        //this.refreshData();

    }


    getBillingStatusType(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/billing-status-type/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getCompany(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/participants/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getBanks(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/banks/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getBillingType(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/billing-types/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getBillingWindows(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/billing-windows/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getDteTypes(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/dte-types/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getPaymentDueType(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/payment-due-type/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getPaymentStatusType(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/payment-status-type/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getDteAcceptanceStatus(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/dte-acceptance-status/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getTransactionTypes(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/transaction-types/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getInstructions(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/instructions/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getPaymentMatrices(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/payment-matrices/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getDte(filters, callback) {

        if (typeof (filters) === "function" && typeof (callback) === "undefined") {
            callback = filters;
            filters = {};
        }

        var str_filter = "";
        for (var i = 0; i < Object.keys(filters).length; i++) {
            var filter = Object.keys(filters)[i];
            if (i === 0) str_filter = "?";
            str_filter = str_filter + filter + "=" + filters[filter];
            if (i < Object.keys(filters).length - 1) str_filter = str_filter + "&";
        }

        request(this.endpoint + '/api/v1/resources/dtes/' + str_filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    // REFRESH DATA

    refreshData() {

        // GET BillingStatusType DATA
        this.getBillingStatusType({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    name: resp.results[i].name,
                    natural_key: resp.results[i].natural_key
                }
                updateOrCreate(models.billing_status_type, { id: data.id }, data);
            }
        });

        // GET Company DATA
        this.getCompany({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    name: resp.results[i].name,
                    rut: resp.results[i].rut,
                    verification_code: resp.results[i].verification_code,
                    business_name: resp.results[i].business_name,
                    commercial_business: resp.results[i].commercial_business,
                    dte_reception_email: resp.results[i].dte_reception_email,
                    bank_account: resp.results[i].bank_account,
                    bank: resp.results[i].bank,
                    commercial_address: resp.results[i].commercial_address,
                    postal_address: resp.results[i].postal_address,
                    manager: resp.results[i].manager,
                    p_c_first_name: resp.results[i].payments_contact ? resp.results[i].payments_contact.first_name : "",
                    p_c_last_name: resp.results[i].payments_contact ? resp.results[i].payments_contact.last_name : "",
                    p_c_address: resp.results[i].payments_contact ? resp.results[i].payments_contact.address : "",
                    p_c_phones: resp.results[i].payments_contact ? resp.results[i].payments_contact.phones.toString() : "",
                    p_c_email: resp.results[i].payments_contact ? resp.results[i].payments_contact.email : "",
                    b_c_first_name: resp.results[i].bills_contact ? resp.results[i].bills_contact.first_name : "",
                    b_c_last_name: resp.results[i].bills_contact ? resp.results[i].bills_contact.last_name : "",
                    b_c_address: resp.results[i].bills_contact ? resp.results[i].bills_contact.address : "",
                    b_c_phones: resp.results[i].bills_contact ? resp.results[i].bills_contact.phones.toString() : "",
                    b_c_email: resp.results[i].bills_contact ? resp.results[i].bills_contact.email : "",
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts
                }
                updateOrCreate(models.company, { id: data.id }, data);
            }
        });



        // GET PaymentStatusType DATA
        this.getPaymentStatusType({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    name: resp.results[i].name,
                    natural_key: resp.results[i].natural_key
                }
                updateOrCreate(models.payment_status_type, { id: data.id }, data);
            }
        });

        // GET Banks DATA
        this.getBanks({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    code: resp.results[i].code,
                    name: resp.results[i].name,
                    sbif: resp.results[i].sbif,
                    type: resp.results[i].type
                }
                updateOrCreate(models.banks, { id: data.id }, data);
            }
        });


        // GET BillingType DATA
        this.getBillingType({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    natural_key: resp.results[i].natural_key,
                    title: resp.results[i].title,
                    system_prefix: resp.results[i].system_prefix,
                    description_prefix: resp.results[i].description_prefix,
                    payment_window: resp.results[i].payment_window,
                    department: resp.results[i].department,
                    enabled: resp.results[i].enabled
                }
                updateOrCreate(models.billing_type, { id: data.id }, data);
            }
        });

        // GET BillingWindows DATA
        this.getBillingWindows({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    natural_key: resp.results[i].natural_key,
                    billing_type: resp.results[i].billing_type,
                    periods: resp.results[i].periods.toString(),
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts
                }
                updateOrCreate(models.billing_windows, { id: data.id }, data);
            }
        });

        // GET DteAcceptanceStatus DATA
        this.getDteAcceptanceStatus({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    code: resp.results[i].code,
                    name: resp.results[i].name
                }
                updateOrCreate(models.dte_acceptance_status, { id: data.id }, data);
            }
        });

        // GET DteTypes DATA
        this.getDteTypes({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    code: resp.results[i].code,
                    name: resp.results[i].name,
                    sii_code: resp.results[i].sii_code,
                    factor: resp.results[i].factor
                }
                updateOrCreate(models.dte_type, { id: data.id }, data);
            }
        });

        // GET PaymentDueType DATA
        this.getPaymentDueType({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    name: resp.results[i].name,
                    natural_key: resp.results[i].natural_key
                }
                updateOrCreate(models.payment_due_type, { id: data.id }, data);
            }
        });

        // GET TransactionTypes DATA
        this.getTransactionTypes({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id: resp.results[i].id,
                    code: resp.results[i].code,
                    name: resp.results[i].name
                }
                updateOrCreate(models.transaction_type, { id: data.id }, data);
            }
        });

        // GET Instructions Debtor DATA
        this.getInstructions({ debtor: 339, limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id_cen: resp.results[i].id,
                    payment_matrix: resp.results[i].payment_matrix,
                    creditor: resp.results[i].creditor,
                    debtor: resp.results[i].debtor,
                    amount: resp.results[i].amount,
                    amount_gross: resp.results[i].amount_gross,
                    closed: resp.results[i].closed === false ? "false" : "true",
                    status: resp.results[i].status,
                    status_billed: resp.results[i].status_billed,
                    status_paid: resp.results[i].status_paid,
                    resolution: resp.results[i].resolution,
                    max_payment_date: resp.results[i].max_payment_date,
                    informed_paid_amount: resp.results[i].informed_paid_amount,
                    is_paid: resp.results[i].is_paid,
                    aux_data_payment_matrix_natural_key: resp.results[i].aux_data_payment_matrix_natural_key,
                    aux_data_payment_matrix_concept: resp.results[i].aux_data_payment_matrix_concept,
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts
                }
                updateOrCreate(models.instructions, { id_cen: data.id_cen }, data);
            }
        });

        // GET Instructions Creditor DATA
        this.getInstructions({ creditor: 339, limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id_cen: resp.results[i].id,
                    payment_matrix: resp.results[i].payment_matrix,
                    creditor: resp.results[i].creditor,
                    debtor: resp.results[i].debtor,
                    amount: resp.results[i].amount,
                    amount_gross: resp.results[i].amount_gross,
                    closed: resp.results[i].closed === false ? "false" : "true",
                    status: resp.results[i].status,
                    status_billed: resp.results[i].status_billed,
                    status_paid: resp.results[i].status_paid,
                    resolution: resp.results[i].resolution,
                    max_payment_date: resp.results[i].max_payment_date,
                    informed_paid_amount: resp.results[i].informed_paid_amount,
                    is_paid: resp.results[i].is_paid,
                    aux_data_payment_matrix_natural_key: resp.results[i].aux_data_payment_matrix_natural_key,
                    aux_data_payment_matrix_concept: resp.results[i].aux_data_payment_matrix_concept,
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts
                }
                updateOrCreate(models.instructions, { id_cen: data.id_cen }, data);
            }
        });

        // GET PaymentMatrices DATA
        this.getPaymentMatrices({ limit: 5000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id_cen: resp.results[i].id,
                    auxiliary_data: resp.results[i].auxiliary_data.toString(),
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts,
                    payment_type: resp.results[i].payment_type,
                    version: resp.results[i].version,
                    payment_file: resp.results[i].payment_file,
                    letter_code: resp.results[i].letter_code,
                    letter_year: resp.results[i].letter_year,
                    letter_file: resp.results[i].letter_file,
                    matrix_file: resp.results[i].matrix_file,
                    publish_date: resp.results[i].publish_date,
                    payment_days: resp.results[i].payment_days,
                    payment_date: resp.results[i].payment_date,
                    billing_date: resp.results[i].billing_date,
                    payment_window: resp.results[i].payment_window,
                    natural_key: resp.results[i].natural_key,
                    reference_code: resp.results[i].reference_code,
                    billing_window: resp.results[i].billing_window,
                    payment_due_type: resp.results[i].payment_due_type
                }
                updateOrCreate(models.payment_matrices, { id_cen: data.id_cen }, data);
            }
        });

        // GET DTEs DATA
        this.getDte({ debtor: 339, limit: 10000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id_cen: resp.results[i].id,
                    instruction: resp.results[i].instruction,
                    type: resp.results[i].type,
                    folio: resp.results[i].folio,
                    gross_amount: resp.results[i].gross_amount,
                    net_amount: resp.results[i].net_amount,
                    reported_by_creditor: resp.results[i].reported_by_creditor,
                    emission_dt: resp.results[i].emission_dt,
                    emission_file: resp.results[i].emission_file,
                    emission_erp_a: resp.results[i].emission_erp_a,
                    emission_erp_b: resp.results[i].emission_erp_b,
                    reception_dt: resp.results[i].reception_dt,
                    reception_erp: resp.results[i].reception_erp,
                    acceptance_dt: resp.results[i].acceptance_dt,
                    acceptance_erp: resp.results[i].acceptance_erp,
                    acceptance_status: resp.results[i].acceptance_status,
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts
                }
                updateOrCreate(models.dte, { id_cen: data.id_cen }, data);
            }
        });

        // GET DTEs DATA
        this.getDte({ creditor: 339, limit: 10000, offset: 0 }, function (resp) {
            // IF NO RESULTS -> EXIT
            if (resp.results.length === 0) return
            // UPDATE OR CREATE RECORDS
            for (var i = 0; i < resp.results.length; i++) {
                var data = {
                    id_cen: resp.results[i].id,
                    instruction: resp.results[i].instruction,
                    type: resp.results[i].type,
                    folio: resp.results[i].folio,
                    gross_amount: resp.results[i].gross_amount,
                    net_amount: resp.results[i].net_amount,
                    reported_by_creditor: resp.results[i].reported_by_creditor,
                    emission_dt: resp.results[i].emission_dt,
                    emission_file: resp.results[i].emission_file,
                    emission_erp_a: resp.results[i].emission_erp_a,
                    emission_erp_b: resp.results[i].emission_erp_b,
                    reception_dt: resp.results[i].reception_dt,
                    reception_erp: resp.results[i].reception_erp,
                    acceptance_dt: resp.results[i].acceptance_dt,
                    acceptance_erp: resp.results[i].acceptance_erp,
                    acceptance_status: resp.results[i].acceptance_status,
                    created_ts: resp.results[i].created_ts,
                    updated_ts: resp.results[i].updated_ts
                }
                updateOrCreate(models.dte, { id_cen: data.id_cen }, data);
            }
        });

        setTimeout(function () {

            cen.refreshData();

        }, (this.config.cenAPI.refreshPeriod));
    }
}

function updateOrCreate(model, where, data) {
    model.findOrCreate({ where: where })
        .spread((record, created) => {
            // IF ALREADY EXISTS, I UPDATE THE DATA
            // ELSE I CREATE THE RECORD AND ADD THE NEW DATA
            if (!created) {
                record.updateAttributes(data);
            } else {
                record.updateAttributes(data);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

module.exports = CEN;
