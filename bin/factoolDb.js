var db = require("../nodeLib/db.js");
var bcrypt = require('bcrypt');
const saltRounds = 10;


exports.connect = function (conf, callback) {
    return db.connect(conf, callback);
}

// SELECT 

exports.findCompany = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM company ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findInstructions = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM instructions ";


    if (options.where !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            switch (typeof (options.where[field])) {
                case "number":
                    query = query + field + "=" + options.where[field];
                    break;
                case "string":
                    if (options.where[field].includes(",")) {
                        query = query + field + " IN (" + options.where[field] + ")";
                        break;
                    } else {
                        query = query + field + "='" + options.where[field].replace("'", "") + "'";
                        break;
                    }
                case "object":
                    if (options.where[field] instanceof Date) {
                        query = query + field + "='" + moment(options.where[field]).format("Y-MM-DD HH:mm:ss") + "'";
                    }
                    break;
            }

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }


    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findBillingStatusType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM billing_status_type ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findPaymentStatusType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM payment_status_type ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findDteTypes = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM dte_types ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findUser = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: { enabled: 1 },
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM user ";

    query = query + " WHERE ";
    for (var i = 0; i < Object.keys(options.where).length; i++) {
        var field = Object.keys(options.where)[i];

        query = query + field + "='" + options.where[field] + "'";

        if (i < Object.keys(options.where).length - 1) {
            query = query + " AND ";
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findOneUser = function (options, callback) {

    this.findUser({ where: options }, function (err, rows, fields) {


        if (err) {
            return callback(err);
        }

        if (rows.length === 0) {
            return callback(null, false);
        }

        return callback(false, rows[0]);

    });

}

exports.findBillingWindows = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM billing_windows ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findBillingType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM billing_type ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findDteAcceptanceStatus = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM dte_acceptance_status ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findBanks = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM banks ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findPaymentDueType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM payment_due_type ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findTransactionTypes = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM transaction_types ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}

exports.findPaymentMatrices = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Evc expects an option Object and a callback."))
    }

    if (typeof (options) === "function" && typeof (callback) === "undefined") {
        callback = options;
        options = {};
    }

    options = Object.assign({
        where: {},
        select: ["*"],
        order: { id: "ASC" }
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM payment_matrices ";

    if (options.where.length !== undefined) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    query = query + " ORDER BY ";
    for (var i = 0; i < Object.keys(options.order).length; i++) {
        var field = Object.keys(options.order)[i];

        query = query + field + " " + options.order[field];

        if (i < Object.keys(options.order).length - 1) {
            query = query + " , ";
        }
    }

    return db.get().query(query, callback);

}





exports.getLastPaymentMatricesTimestamp = function (callback) {

    query = "SELECT MAX(created_ts) as lastRefresh FROM payment_matrices";
    return db.get().query(query, callback);

}

exports.getLastInstructionsTimestamp = function (callback) {

    query = "SELECT MAX(created_ts) as lastRefresh FROM instructions";
    return db.get().query(query, callback);

}

exports.deleteUser = function (user, callback) {

    query = "DELETE FROM user WHERE id=" + user.id;

    console.log(query);

    return db.get().query(query, callback);

}

exports.hashPassword = function (password, callback) {

    bcrypt.hash(password, saltRounds, function (err, hash) {

        return callback(err, hash);
    })
}

exports.isUserPasswordValid = function (user, password, callback) {

    bcrypt.compare(password, user.password, function (err, res) {

        if (res) {
            return callback(true);
        }

        return callback(false);

    });
}



// INSERT INTO 

exports.saveCompany = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO company (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveInstructions = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO instructions (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.savePaymentMatrices = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO payment_matrices (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveUser = function (user, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    if (!("id" in user)) {
        //CREATE NEW EVC
        query = "INSERT INTO user SET ";
    } else {
        query = "UPDATE user SET ";
    }

    for (field in user) {

        query = query + " " + field + "=";

        switch (typeof (user[field])) {
            case "number":
                query = query + user[field];
                break;
            case "string":
                query = query + "'" + user[field].replace("'", "\"") + "'";
                break;
            case "object":
                if (user[field] instanceof Date) {
                    query = query + "'" + moment(user[field]).format("Y-MM-DD HH:mm:ss") + "'";
                } else if (user[field] === null) {
                    query = query + " null ";
                } else {
                    query = query + "'" + JSON.stringify(user[field]) + "'";
                }
                break;
            case "boolean":
                if (user[field]) {
                    query = query + "1";
                } else {
                    query = query + "0";
                }
                break;
            case "undefined":
                break;
        }
        query = query + ",";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1);
    }

    if ("id" in user) {
        query = query + " WHERE id=" + user.id;
    }

    console.log(query);

    return db.get().query(query, callback);

}

exports.saveUserLogin = function (user, callback) {

    query = "UPDATE user SET last_login='" + moment().format("Y-MM-DD HH:mm:ss") + "' WHERE id=" + user.id;
    return db.get().query(query, callback);

}

exports.saveBillingStatusType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO billing_status_type (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.savePaymentStatusType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO payment_status_type (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveDteTypes = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO dte_types (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveDteAcceptanceStatus = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO dte_acceptance_status (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveBillingWindows = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO billing_windows (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveBillingType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO billing_type (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveBanks = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO banks (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.savePaymentDueType = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO payment_due_type (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}

exports.saveTransactionTypes = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO transaction_types (";

    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];
            query = query + field;
            if (j < Object.keys(options.values[index]).length - 1) {
                query = query + ",";
            }
        }
        break;
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES "
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        query = query + "(";
        var index = Object.keys(options.values)[i];
        for (var j = 0; j < Object.keys(options.values[index]).length; j++) {
            var field = Object.keys(options.values[index])[j];

            switch (typeof (options.values[index][field])) {
                case "boolean":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "number":
                    query = query + options.values[index][field];
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "string":
                    query = query + "'" + options.values[index][field].replace("'", "") + "'";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "object":
                    if (options.values[index][field] instanceof Date) {
                        query = query + "'" + moment(options.values[index][field]).format("Y-MM-DD HH:mm:ss") + "'";
                    } else {
                        query = query + "'" + JSON.stringify(options.values[index][field]) + "'";
                    }
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
                case "undefined":
                    query = query + "''";
                    if (j < Object.keys(options.values[index]).length - 1) {
                        query = query + ",";
                    }
                    break;
            }
        }
        if (query.lastIndexOf(',') + 1 == query.length) {
            query = query.substr(0, query.length - 1)
        }
        query = query + "),";
    }

    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }

    return db.get().query(query, callback);

}