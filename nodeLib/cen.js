var request = require('request');

const fs = require('fs');

class CEN {

    constructor(config) {

        var test = true;
        if (test) {
            this.endpoint = "https://staging-ppagos-sen.coordinadorelectrico.cl";
        } else {
            this.endpoint = "https://ppagos-sen.coordinadorelectrico.cl";
        }

        this.config = config;
        this.username = this.config.cenAPI.username;
        this.password = this.config.cenAPI.password;
        this.authtoken = "";
        this.idCompany = 0;
        this.plants = {};

        // GET AUTH TOKEN
        this.getToken(this.username, this.password, function (err, token) {
            if (err) {
                return logger.log(err);
            }
            cen.authtoken = token;
        });

        // GET DATA TYPES
        //this.refreshDataTypes();

        // SET THE DEFAULT COMPANY IDs
        this.getPlants(function () {
            // REFRESH DATA EACH 15min
            //cen.refreshData(function () {
                logger.log("REFRESH DATA COMPLETED");
            //});
        });

    }

    getPlants(callback) {
        models.plants.findAll().then(plants => {
            cen.plants = plants
            return callback();
        });
    }

    getFileFromUrl(url, path, callback) {
        var fs = require('fs');

        if (!url) return callback("no url", false);
        logger.log(url);
        request
            .get(url)
            .pipe(fs.createWriteStream(path))
            .on('error', function (err) {
                logger.log(err);
                callback(err, false);
            })
            .on('finish', function () {
                callback(null, true);
            });
    }

    putAuxiliaryFiles(data, callback) {

        var fs = require('fs');
        var path = require('path');
        var path = path.join(global.appRoot, '/public/invoice/pdf/F' + data.folio + 'T' + data.type + '.pdf');

        //logger.log(data);
        this.getFileFromUrl(data.urlCedible, path, function (err, result) {

            if (err) {
                return callback(err, null, null);
            }

            if (result) {
                request({
                    method: 'PUT',
                    preambleCRLF: true,
                    postambleCRLF: true,
                    headers: {
                        'Authorization': 'Token ' + cen.authtoken,
                        'Content-Disposition': 'attachment; filename=F' + data.folio + 'T' + data.type + '.pdf'
                    },
                    uri: cen.endpoint + "/api/v1/resources/auxiliary-files/",
                    multipart: [
                        {
                            'content-type': 'application/pdf',
                            body: fs.createReadStream(path)
                        }
                    ]
                }, function (err, res, body) {
                    if (err) return callback(err, null, null);
                    var result = JSON.parse(body);
                    return callback(null, result.invoice_file_id, result.file_url);
                });
            }
        });
    }

    postCreateDte(data, callback) {

        var create_at = new Date(data.created_at);

        if (data.reported_by_creditor) {
            var dataString = {
                instruction: data.instruction,
                type_sii_code: data.type,
                folio: data.folio,
                gross_amount: data.gross_amount,
                net_amount: data.net_amount,
                reported_by_creditor: data.reported_by_creditor,
                emission_dt: moment(create_at).format("Y-M-D"),
                emission_file: data.invoice_file_id_cen,
                emission_erp_a: "",
                emission_erp_b: "",
                reception_dt: moment(create_at).format("Y-M-D"),
                reception_erp: "",
                acceptance_erp: "",
                acceptance_status: ""
            }
        } else {
            var dataString = {
                instruction: data.instruction,
                type_sii_code: data.type,
                folio: data.folio,
                gross_amount: data.gross_amount,
                net_amount: data.net_amount,
                reported_by_creditor: data.reported_by_creditor,
                emission_erp_a: "",
                emission_erp_b: "",
                reception_erp: "",
                acceptance_dt: moment(data.acceptance_dt).format("Y-M-D"),
                acceptance_erp: "",
                acceptance_status: data.acceptance_status
            }
        }

        request.post({
            headers: {
                'Authorization': 'Token ' + this.authtoken
            },
            url: this.endpoint + '/api/v1/operations/dtes/create/',
            formData: { data: JSON.stringify(dataString) }
        }, function (err, res, body) {
            if (err) return callback(err, false)
            var result = JSON.parse(body);
            if (result.errors.length) return callback(result.errors, false)
            return callback(null, true);
        });


    }


    postAcceptedDte(data, callback) {

        var accepted_at = new Date();

        var dataString = {
            folio: data.folio,
            gross_amount: data.gross_amount,
            net_amount: data.net_amount,
            reported_by_creditor: false,
            acceptance_dt: moment(accepted_at).format("Y-M-D"),
            acceptance_erp: "",
            acceptance_status: 1
        }

        request.post({
            headers: {
                'Authorization': 'Token ' + this.authtoken
            },
            url: this.endpoint + '/api/v1/operations/dtes/' + data.id_cen + '/edit/',
            formData: { data: JSON.stringify(dataString) }
        }, function (err, res, body) {
            if (err) return callback(err, false)
            var result = JSON.parse(body);
            if (result.errors.length) return callback(result.errors, false)
            return callback(null, true);
        });

    }

    postRejectedDte(data, callback) {

        var rejected_at = new Date();

        var dataString = {
            folio: data.folio,
            gross_amount: data.gross_amount,
            net_amount: data.net_amount,
            reported_by_creditor: false,
            acceptance_dt: moment(rejected_at).format("Y-M-D"),
            acceptance_erp: "",
            acceptance_status: 2
        }

        request.post({
            headers: {
                'Authorization': 'Token ' + this.authtoken
            },
            url: this.endpoint + '/api/v1/operations/dtes/' + data.id_cen + '/edit/',
            formData: { data: JSON.stringify(dataString) }
        }, function (err, res, body) {
            if (err) return callback(err, false)
            var result = JSON.parse(body);
            if (result.errors.length) return callback(result.errors, false)
            return callback(null, true);
        });

    }

    postCreatePayment(data, callback) {

        var dataString = {
            debtor: data.debtor,
            creditor: data.creditor,
            amount: data.amount,
            payment_dt: data.payment_dt,
            transaction_type: data.transaction_type,
            actual_collector: data.actual_collector,
            instruction_amount_tuples: data.instruction_amount_tuples
        }

        request.post({
            headers: {
                'Authorization': 'Token ' + this.authtoken
            },
            url: this.endpoint + '/api/v1/operations/payments/create/',
            formData: { data: JSON.stringify(dataString) }
        }, function (err, res, body) {
            if (err) return callback(err, false)
            var result = JSON.parse(body);
            if (result.errors.length) return callback(result.errors, false)
            return callback(null, true);
        });

    }

    getToken(username, password, callback) {

        request.post({
            headers: { 'content-type': 'application/json' },
            url: this.endpoint + '/api/token-auth/',
            json: {
                "username": username,
                "password": password
            }
        }, function (error, response, body) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, body.token);
        });
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
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
                return callback(error);
            }
            var result = JSON.parse(body);
            return callback(result);
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
                return callback(error);
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
                return callback(error);
            }
            var result = JSON.parse(body);
            callback(result);
        });
    }

    // REFRESH DATA TYPES

    refreshDataTypes() {

        var me = this;

        logger.log("START GET DATA TYPES");

        async.parallel([
            function (callback) {
                // GET BillingStatusType DATA
                me.getBillingStatusType({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            name: resp.results[key].name,
                            natural_key: resp.results[key].natural_key
                        }
                        updateOrCreate(models.billing_status_type, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET PaymentStatusType DATA
                me.getPaymentStatusType({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            name: resp.results[key].name,
                            natural_key: resp.results[key].natural_key
                        }
                        updateOrCreate(models.payment_status_type, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET Banks DATA
                me.getBanks({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            code: resp.results[key].code,
                            name: resp.results[key].name,
                            sbif: resp.results[key].sbif,
                            type: resp.results[key].type
                        }
                        updateOrCreate(models.banks, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET BillingType DATA
                me.getBillingType({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            natural_key: resp.results[key].natural_key,
                            title: resp.results[key].title,
                            system_prefix: resp.results[key].system_prefix,
                            description_prefix: resp.results[key].description_prefix,
                            payment_window: resp.results[key].payment_window,
                            department: resp.results[key].department,
                            enabled: resp.results[key].enabled
                        }
                        updateOrCreate(models.billing_type, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET DteAcceptanceStatus DATA
                me.getDteAcceptanceStatus({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            code: resp.results[key].code,
                            name: resp.results[key].name
                        }
                        updateOrCreate(models.dte_acceptance_status, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET DteTypes DATA
                me.getDteTypes({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            code: resp.results[key].code,
                            name: resp.results[key].name,
                            sii_code: resp.results[key].sii_code,
                            factor: resp.results[key].factor
                        }
                        updateOrCreate(models.dte_type, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET PaymentDueType DATA
                me.getPaymentDueType({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            name: resp.results[key].name,
                            natural_key: resp.results[key].natural_key
                        }
                        updateOrCreate(models.payment_due_type, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            },
            function (callback) {
                // GET TransactionTypes DATA
                me.getTransactionTypes({ limit: 5000, offset: 0 }, function (resp) {
                    // IF NO RESULTS -> EXIT
                    if (!resp.results) return
                    if (resp.results.length === 0) return callback("No results for the API response.", false);
                    // UPDATE OR CREATE RECORDS
                    async.forEachOf(resp.results, function (value, key, callback) {
                        var data = {
                            id: resp.results[key].id,
                            code: resp.results[key].code,
                            name: resp.results[key].name
                        }
                        updateOrCreate(models.transaction_type, { id: data.id }, data, function (err) {
                            if (err) return callback(err);
                            return callback();
                        });

                    }, function (err) {
                        if (err) return callback(err)
                        return callback();
                    });
                });
            }
        ],
            // optional callback
            function (err, results) {
                if (err) return logger.log("GET DATA TYPES - NOT OK: " + err);
                return logger.log("GET DATA TYPES - OK");
            });

    }

    // REFRESH DATA

    refreshData(options, callback) {

        if (typeof (options) === "function" && typeof (callback) === "undefined") {
            callback = options;
            options = undefined;
        }

        var me = this;

        if (options) {
            if (options.id) {

                logger.log("START GET DATA " + options.filter + " FOR IDCOMPANY: " + options.id);

                switch (options.filter) {
                    case "Company":
                        updateCompany(me, { limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                    case "BillingWindows":
                        updateBillingWindows(me, { limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                    case "InstructionsC":
                        updateInstructions(me, { creditor: options.id, limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                    case "InstructionsD":
                        updateInstructions(me, { debtor: options.id, limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                    case "PaymentMatrices":
                        updatePaymentMatrices(me, { limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                    case "DteC":
                        updateDte(me, { creditor: options.id, limit: 10000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                    case "DteD":
                        updateDte(me, { debtor: options.id, limit: 10000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            logger.log("GET DATA " + options.filter + " - OK");
                            return callback();
                        });
                        break;
                }

            } else {

                async.forEachOf(me.plants, function (value, key, callback) {
                    logger.log("START GET DATA " + options + " FOR IDCOMPANY: " + idCompany);

                    switch (options) {
                        case "Company":
                            updateCompany(me, { limit: 5000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                        case "BillingWindows":
                            updateBillingWindows(me, { limit: 5000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                        case "InstructionsC":
                            updateInstructions(me, { creditor: idCompany, limit: 5000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                        case "InstructionsD":
                            updateInstructions(me, { debtor: idCompany, limit: 5000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                        case "PaymentMatrices":
                            updatePaymentMatrices(me, { limit: 5000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                        case "DteC":
                            updateDte(me, { creditor: idCompany, limit: 10000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                        case "DteD":
                            updateDte(me, { debtor: idCompany, limit: 10000, offset: 0 }, function (err, result) {
                                if (err) return callback(err);
                                logger.log("GET DATA " + options + " - OK");
                                return callback();
                            });
                            break;
                    }
                }, function (err) {
                    if (err) return callback(err);
                    return callback();
                });
            }
        } else {
            async.forEachOf(me.plants, function (value, key, callback) {
                var idCompany = value.company_cen_id;
                if (value.enable !== 1) return callback();

                logger.log("START GET DATA FOR IDCOMPANY: " + idCompany);

                async.parallel([
                    function (callback) {
                        updateCompany(me, { limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    },
                    function (callback) {
                        updateDte(me, { creditor: idCompany, limit: 10000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    },
                    function (callback) {
                        updateDte(me, { debtor: idCompany, limit: 10000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    },
                    function (callback) {
                        updatePaymentMatrices(me, { limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    },
                    function (callback) {
                        updateBillingWindows(me, { limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    },
                    function (callback) {
                        updateInstructions(me, { creditor: idCompany, limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    },
                    function (callback) {
                        updateInstructions(me, { debtor: idCompany, limit: 5000, offset: 0 }, function (err, result) {
                            if (err) return callback(err);
                            return callback();
                        });
                    }
                ],
                    // optional callback
                    function (err, results) {
                        if (err) return callback(err);
                        logger.log("GET DATA " + idCompany + " - OK");
                        return callback();
                    });

                setTimeout(function () {

                    cen.refreshData(function (err) {
                        if (err) logger.log(err);
                    });

                }, (cen.config.cenAPI.refreshPeriod));

            }, function (err) {
                //logger.log("refreshData COMPLETED");
                return callback();
            });
        }
    }
}

function updateOrCreate(model, where, data, callback) {
    model.findOrCreate({ where: where })
        .spread((record, created) => {
            // IF ALREADY EXISTS, I UPDATE THE DATA
            // ELSE I CREATE THE RECORD AND ADD THE NEW DATA
            if (!created) {
                record.updateAttributes(data);
            } else {
                record.updateAttributes(data);
            }
            return callback(null, true);
        })
        .catch(function (error) {
            console.log(error);
            return callback(error, false);
        });
}

function updateCompany(cen, filter, callback) {
    cen.getCompany(filter, function (resp) {
        // IF NO RESULTS -> EXIT
        if (!resp.results) return callback("Connection problem - API no work.", false);
        if (resp.results.length === 0) return callback("No results for the API response.", false);
        // UPDATE OR CREATE RECORDS
        async.forEachOf(resp.results, function (value, key, callback) {
            var data = {
                id: resp.results[key].id,
                name: resp.results[key].name,
                rut: resp.results[key].rut,
                verification_code: resp.results[key].verification_code,
                business_name: resp.results[key].business_name,
                commercial_business: resp.results[key].commercial_business,
                dte_reception_email: resp.results[key].dte_reception_email,
                bank_account: resp.results[key].bank_account,
                bank: resp.results[key].bank,
                commercial_address: resp.results[key].commercial_address,
                postal_address: resp.results[key].postal_address,
                manager: resp.results[key].manager,
                p_c_first_name: resp.results[key].payments_contact ? resp.results[key].payments_contact.first_name : "",
                p_c_last_name: resp.results[key].payments_contact ? resp.results[key].payments_contact.last_name : "",
                p_c_address: resp.results[key].payments_contact ? resp.results[key].payments_contact.address : "",
                p_c_phones: resp.results[key].payments_contact ? resp.results[key].payments_contact.phones.toString() : "",
                p_c_email: resp.results[key].payments_contact ? resp.results[key].payments_contact.email : "",
                b_c_first_name: resp.results[key].bills_contact ? resp.results[key].bills_contact.first_name : "",
                b_c_last_name: resp.results[key].bills_contact ? resp.results[key].bills_contact.last_name : "",
                b_c_address: resp.results[key].bills_contact ? resp.results[key].bills_contact.address : "",
                b_c_phones: resp.results[key].bills_contact ? resp.results[key].bills_contact.phones.toString() : "",
                b_c_email: resp.results[key].bills_contact ? resp.results[key].bills_contact.email : "",
                created_ts: resp.results[key].created_ts,
                updated_ts: resp.results[key].updated_ts
            }
            updateOrCreate(models.company, { id: data.id }, data, function (err) {
                if (err) return callback(err);
                return callback();
            });

        }, function (err) {
            if (err) return callback(err)
            return callback();
        });
    });

}

function updateInstructions(cen, filter, callback) {
    // GET Instructions Debtor DATA
    cen.getInstructions(filter, function (resp) {
        // IF NO RESULTS -> EXIT
        if (!resp.results) return callback("Connection problem - API no work.", false);
        if (resp.results.length === 0) return callback("No results for the API response.", false);
        // UPDATE OR CREATE RECORDS
        async.forEachOf(resp.results, function (value, key, callback) {
            var data = {
                id_cen: resp.results[key].id,
                payment_matrix: resp.results[key].payment_matrix,
                creditor: resp.results[key].creditor,
                debtor: resp.results[key].debtor,
                amount: resp.results[key].amount,
                amount_gross: resp.results[key].amount_gross,
                closed: resp.results[key].closed === false ? "false" : "true",
                status: resp.results[key].status,
                status_billed: resp.results[key].status_billed,
                status_paid: resp.results[key].status_paid,
                resolution: resp.results[key].resolution,
                max_payment_date: resp.results[key].max_payment_date,
                informed_paid_amount: resp.results[key].informed_paid_amount,
                is_paid: resp.results[key].is_paid,
                aux_data_payment_matrix_natural_key: resp.results[key].aux_data_payment_matrix_natural_key,
                aux_data_payment_matrix_concept: resp.results[key].aux_data_payment_matrix_concept,
                created_ts: resp.results[key].created_ts,
                updated_ts: resp.results[key].updated_ts
            }
            updateOrCreate(models.instructions, { id_cen: data.id_cen }, data, function (err) {
                if (err) return callback(err);
                return callback();
            });

        }, function (err) {
            if (err) return callback(err)
            return callback();
        });
    });

}

function updatePaymentMatrices(cen, filter, callback) {
    // GET PaymentMatrices DATA
    cen.getPaymentMatrices(filter, function (resp) {
        // IF NO RESULTS -> EXIT
        if (!resp.results) return callback("Connection problem - API no work.", false);
        if (resp.results.length === 0) return callback("No results for the API response.", false);
        // UPDATE OR CREATE RECORDS
        async.forEachOf(resp.results, function (value, key, callback) {
            var data = {
                id_cen: resp.results[key].id,
                auxiliary_data: resp.results[key].auxiliary_data.toString(),
                created_ts: resp.results[key].created_ts,
                updated_ts: resp.results[key].updated_ts,
                payment_type: resp.results[key].payment_type,
                version: resp.results[key].version,
                payment_file: resp.results[key].payment_file,
                letter_code: resp.results[key].letter_code,
                letter_year: resp.results[key].letter_year,
                letter_file: resp.results[key].letter_file,
                matrix_file: resp.results[key].matrix_file,
                publish_date: resp.results[key].publish_date,
                payment_days: resp.results[key].payment_days,
                payment_date: resp.results[key].payment_date,
                billing_date: resp.results[key].billing_date,
                payment_window: resp.results[key].payment_window,
                natural_key: resp.results[key].natural_key,
                reference_code: resp.results[key].reference_code,
                billing_window: resp.results[key].billing_window,
                payment_due_type: resp.results[key].payment_due_type
            }
            updateOrCreate(models.payment_matrices, { id_cen: data.id_cen }, data, function (err) {
                if (err) return callback(err);
                return callback();
            });

        }, function (err) {
            if (err) return callback(err)
            return callback();
        });
    });

}

function updateDte(cen, filter, callback) {
    // GET DTEs DATA
    cen.getDte(filter, function (resp) {
        // IF NO RESULTS -> EXIT
        if (!resp.results) return callback("Connection problem - API no work.", false);
        if (resp.results.length === 0) return callback("No results for the API response.", false);
        // UPDATE OR CREATE RECORDS
        async.forEachOf(resp.results, function (value, key, callback) {
            var data = {
                id_cen: resp.results[key].id,
                instruction: resp.results[key].instruction,
                type: resp.results[key].type,
                folio: resp.results[key].folio,
                gross_amount: resp.results[key].gross_amount,
                net_amount: resp.results[key].net_amount,
                reported_by_creditor: resp.results[key].reported_by_creditor,
                emission_dt: resp.results[key].emission_dt,
                emission_file: resp.results[key].emission_file,
                emission_erp_a: resp.results[key].emission_erp_a,
                emission_erp_b: resp.results[key].emission_erp_b,
                reception_dt: resp.results[key].reception_dt,
                reception_erp: resp.results[key].reception_erp,
                acceptance_dt: resp.results[key].acceptance_dt,
                acceptance_erp: resp.results[key].acceptance_erp,
                acceptance_status: resp.results[key].acceptance_status,
                created_ts: resp.results[key].created_ts,
                updated_ts: resp.results[key].updated_ts
            }
            updateOrCreate(models.dte, { id_cen: data.id_cen }, data, function (err) {
                if (err) return callback(err);
                return callback();
            });

        }, function (err) {
            if (err) return callback(err)
            return callback();
        });
    });
}

function updateBillingWindows(cen, filter, callback) {
    // GET BillingWindows DATA
    cen.getBillingWindows(filter, function (resp) {
        // IF NO RESULTS -> EXIT
        if (!resp.results) return callback("Connection problem - API no work.", false);
        if (resp.results.length === 0) return callback("No results for the API response.", false);
        // UPDATE OR CREATE RECORDS
        async.forEachOf(resp.results, function (value, key, callback) {
            var data = {
                id: resp.results[key].id,
                natural_key: resp.results[key].natural_key,
                billing_type: resp.results[key].billing_type,
                periods: resp.results[key].periods.toString(),
                created_ts: resp.results[key].created_ts,
                updated_ts: resp.results[key].updated_ts
            }
            updateOrCreate(models.billing_windows, { id: data.id }, data, function (err) {
                if (err) return callback(err);
                return callback();
            });

        }, function (err) {
            if (err) return callback(err)
            return callback();
        });
    });
}

module.exports = CEN;
