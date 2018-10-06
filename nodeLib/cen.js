request = require('request');

class CEN {

    constructor(config) {

        this.endpoint = "https://ppagos-sen.coordinadorelectrico.cl";
        this.config = config;


        this.companies = {};
        this.billing_windows = {};
        this.companies = {};
        this.companies = {};
        this.companies = {};

        //attivo funzione di refresh dei dati ogni X minuti
        this.refreshData();

        //load Data
        this.loadData();

    }

    getBillingStatusType(rows, callback) {

        request(this.endpoint + '/api/v1/resources/billing-status-type/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getCompany(rows, callback) {

        var filter = "?limit=5000&offset=0";
        request(this.endpoint + '/api/v1/resources/participants/' + filter, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getBanks(rows, callback) {

        request(this.endpoint + '/api/v1/resources/banks/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getBillingType(rows, callback) {

        request(this.endpoint + '/api/v1/resources/billing-types/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getBillingWindows(rows, callback) {

        request(this.endpoint + '/api/v1/resources/billing-windows/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getDteTypes(rows, callback) {

        request(this.endpoint + '/api/v1/resources/dte-types/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getPaymentDueType(rows, callback) {

        request(this.endpoint + '/api/v1/resources/payment-due-type/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getPaymentStatusType(rows, callback) {

        request(this.endpoint + '/api/v1/resources/payment-status-type/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getDteAcceptanceStatus(rows, callback) {

        request(this.endpoint + '/api/v1/resources/dte-acceptance-status/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getTransactionTypes(rows, callback) {

        request(this.endpoint + '/api/v1/resources/transaction-types/', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    getInstructions(filters, callback) {

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


    // GET DATA FROM API AND LOAD IT INTO OBJECTS

    loadData() {

        // GET COMPANY DATA AND LOAD IT 
        factoolDb.findCompany(function (err, rows, fields) {

            // GET DATA
            cen.getCompany(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.companies[data.id] = {
                        id: data.id,
                        name: data.name,
                        rut: data.rut,
                        created_ts: moment(data.created_ts).format("Y-MM-DD HH:mm:ss"),
                        updated_ts: moment(data.updated_ts).format("Y-MM-DD HH:mm:ss")
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id_cen: res[index].id,
                        name: res[index].name,
                        rut: res[index].rut,
                        verification_code: res[index].verification_code,
                        business_name: res[index].business_name,
                        commercial_business: res[index].commercial_business,
                        dte_reception_email: res[index].dte_reception_email,
                        bank_account: res[index].bank_account,
                        bank: res[index].bank,
                        commercial_address: res[index].commercial_address,
                        postal_address: res[index].postal_address,
                        manager: res[index].manager,
                        p_c_first_name: res[index].payments_contact ? res[index].payments_contact.first_name : "",
                        p_c_last_name: res[index].payments_contact ? res[index].payments_contact.last_name : "",
                        p_c_address: res[index].payments_contact ? res[index].payments_contact.address : "",
                        p_c_phones: res[index].payments_contact ? res[index].payments_contact.phones : "",
                        p_c_email: res[index].payments_contact ? res[index].payments_contact.email : "",
                        b_c_first_name: res[index].bills_contact ? res[index].bills_contact.first_name : "",
                        b_c_last_name: res[index].bills_contact ? res[index].bills_contact.last_name : "",
                        b_c_address: res[index].bills_contact ? res[index].bills_contact.address : "",
                        b_c_phones: res[index].bills_contact ? res[index].bills_contact.phones : "",
                        b_c_email: res[index].bills_contact ? res[index].bills_contact.email : "",
                        created_ts: new Date(res[index].created_ts),
                        updated_ts: new Date(res[index].updated_ts)
                    }
                }

                factoolDb.saveCompany({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Billing Status Type DATA AND LOAD IT 
        factoolDb.findBillingStatusType(function (err, rows, fields) {

            // GET DATA
            cen.getBillingStatusType(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.billing_status_type[data.id] = {
                        id: data[index].id,
                        name: data[index].name,
                        natural_key: data[index].natural_key
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        name: res[index].name,
                        natural_key: res[index].natural_key
                    }
                }

                factoolDb.saveBillingStatusType({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Payment Status Type DATA AND LOAD IT 
        factoolDb.findPaymentStatusType(function (err, rows, fields) {

            // GET DATA
            cen.getPaymentStatusType(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.payment_status_type[data.id] = {
                        id: data[index].id,
                        name: data[index].name,
                        natural_key: data[index].natural_key
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        name: res[index].name,
                        natural_key: res[index].natural_key
                    }
                }

                factoolDb.savePaymentStatusType({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Banks DATA AND LOAD IT 
        factoolDb.findBanks(function (err, rows, fields) {

            // GET DATA
            cen.getBanks(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.banks[data.id] = {
                        id: data[index].id,
                        code: data[index].code,
                        name: data[index].name,
                        sbif: data[index].sbif,
                        type: data[index].type
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        code: res[index].code,
                        name: res[index].name,
                        sbif: res[index].sbif,
                        type: res[index].type
                    }
                }

                factoolDb.saveBanks({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Billing Type DATA AND LOAD IT 
        factoolDb.findBillingType(function (err, rows, fields) {

            // GET DATA
            cen.getBillingType(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.billing_type[data.id] = {
                        id: data[index].id,
                        natural_key: data[index].natural_key,
                        title: data[index].title,
                        system_prefix: data[index].system_prefix,
                        description_prefix: data[index].description_prefix,
                        payment_window: data[index].payment_window,
                        department: data[index].department,
                        enabled: data[index].enabled
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        natural_key: res[index].natural_key,
                        title: res[index].title,
                        system_prefix: res[index].system_prefix,
                        description_prefix: res[index].description_prefix,
                        payment_window: res[index].payment_window,
                        department: res[index].department,
                        enabled: res[index].enabled
                    }
                }

                factoolDb.saveBillingType({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Billing Windows DATA AND LOAD IT 
        factoolDb.findBillingWindows(function (err, rows, fields) {

            // GET DATA
            cen.getBillingWindows(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.billing_windows[data.id] = {
                        id: data[index].id,
                        natural_key: data[index].natural_key,
                        billing_type: data[index].billing_type,
                        periods: data[index].periods,
                        created_ts: data[index].created_ts,
                        updated_ts: data[index].updated_ts
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        natural_key: res[index].natural_key,
                        billing_type: res[index].billing_type,
                        periods: res[index].periods,
                        created_ts: new Date(res[index].created_ts),
                        updated_ts: new Date(res[index].updated_ts)
                    }
                }

                factoolDb.saveBillingWindows({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET DTE Acceptance Status Type DATA AND LOAD IT 
        factoolDb.findDteAcceptanceStatus(function (err, rows, fields) {

            // GET DATA
            cen.getDteAcceptanceStatus(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.dte_acceptance_status[data.id] = {
                        id: data[index].id,
                        code: data[index].code,
                        name: data[index].name
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        code: res[index].code,
                        name: res[index].name
                    }
                }

                factoolDb.saveDteAcceptanceStatus({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET DTE Types DATA AND LOAD IT 
        factoolDb.findDteTypes(function (err, rows, fields) {

            // GET DATA
            cen.getDteTypes(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.dte_types[data.id] = {
                        id: data[index].id,
                        code: data[index].code,
                        name: data[index].name,
                        sii_code: data[index].sii_code,
                        factor: data[index].factor
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        code: res[index].code,
                        name: res[index].name,
                        sii_code: res[index].sii_code,
                        factor: res[index].factor
                    }
                }

                factoolDb.saveDteTypes({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Payment Due Type DATA AND LOAD IT 
        factoolDb.findPaymentDueType(function (err, rows, fields) {

            // GET DATA
            cen.getPaymentDueType(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.payment_due_type[data.id] = {
                        id: data[index].id,
                        name: data[index].name,
                        natural_key: data[index].natural_key
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        name: res[index].name,
                        natural_key: res[index].natural_key
                    }
                }

                factoolDb.savePaymentDueType({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });

        // GET Payment Due Type DATA AND LOAD IT 
        factoolDb.findTransactionTypes(function (err, rows, fields) {

            // GET DATA
            cen.getTransactionTypes(rows, function (resp) {
                if (resp.results.length === 0) return

                // LOAD IN OBJECT
                for (var i = 0; i < resp.length; i++) {
                    var data = resp[i];
                    cen.transaction_types[data.id] = {
                        id: data[index].id,
                        code: data[index].code,
                        name: data[index].name
                    }
                }

                // IF MORE RESULT IN API RESP RESPECT TO THE DB, ADD NEW ONE, ELSE EXIT
                if (resp.results.length === rows.length) return
                var res = checkDifference(rows, resp.results);
                var values = {};
                var index;
                for (var i = 0; i < Object.keys(res).length; i++) {
                    index = parseInt(Object.keys(res)[i]);
                    values[index] = {
                        id: res[index].id,
                        code: res[index].code,
                        name: res[index].name
                    }
                }

                factoolDb.saveTransactionTypes({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });
            });
        });
    }

    refreshData() {

        factoolDb.getLastInstructionsTimestamp(function (err, rows, fields) {
            if (err) {
                console.log('error:', err); // Print the error if one occurred
            }

            var dateFilter;
            if (rows[0].lastRefresh === null) {
                dateFilter = "2018-01-01T00:00:00"
            } else {
                dateFilter = moment(rows[0].lastRefresh).add(1, 'm').toDate().toJSON();
            }

            // filtri Instructions API - debtor
            var filter = {
                created_after: dateFilter,
                debtor: 339,
                limit: 5000,
                offset: 0
            }

            // Aggiorno lista istruzioni di pagamento - debtor
            cen.getInstructions(filter, function (resp) {

                if (resp.results.length === 0) return
                var values = {};
                for (var i = 0; i < Object.keys(resp.results).length; i++) {
                    values[i] = {
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
                        created_ts: new Date(resp.results[i].created_ts),
                        updated_ts: new Date(resp.results[i].updated_ts)
                    }
                }

                factoolDb.saveInstructions({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });

            });


            // filtri Instructions API - creditor
            filter = {
                created_after: dateFilter,
                creditor: 339,
                limit: 1000,
                offset: 0
            }

            // Aggiorno lista istruzioni di pagamento - creditor
            cen.getInstructions(filter, function (resp) {

                if (resp.results.length === 0) return
                var values = {};
                for (var i = 0; i < Object.keys(resp.results).length; i++) {
                    values[i] = {
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
                        created_ts: new Date(resp.results[i].created_ts),
                        updated_ts: new Date(resp.results[i].updated_ts)
                    }
                }

                factoolDb.saveInstructions({ values: values }, function (err, rows, fields) {
                    if (err) {
                        console.log('error:', err); // Print the error if one occurred
                    }
                });

            });
        });

        setTimeout(function () {

            cen.refreshData();

        }, (this.config.cenAPI.refreshPeriod));

    }
}

function checkDifference(rows, results) {
    var diff = {}
    for (var i = 0; i < Object.keys(results).length; i++) {
        if (!rows[i]) {
            diff[i] = results[i];
        }
    }
    return diff;
}

module.exports = CEN;
