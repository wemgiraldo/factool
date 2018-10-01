var db = require("../nodeLib/db.js");
var bcrypt = require('bcrypt');
const saltRounds = 10;


exports.connect = function (conf, callback) {
    return db.connect(conf, callback);
}


exports.saveProject = function (prj, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Evc expects an option Object and a callback."))
    }

    if (!("id" in prj)) {
        //CREATE NEW PROJECT
        return this.addProject({ values: prj }, callback);
    }

    //EDIT EXISTING PROJECT
    return this.updateProject({ set: prj, where: { id: prj.id } }, callback);

}


exports.addProject = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Add Project expects an option Object and a callback."))
    }

    // campi DB
    query = "INSERT INTO project (";
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var field = Object.keys(options.values)[i];

        if (typeof (options.values[field]) !== "undefined") {
            query = query + field;

            if (i < Object.keys(options.values).length - 1) {
                query = query + ",";
            }
        }

    }
    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    // valori DB
    query = query + " VALUES (";
    for (var i = 0; i < Object.keys(options.values).length; i++) {
        var field = Object.keys(options.values)[i];

        switch (typeof (options.values[field])) {
            case "number":
                query = query + options.values[field];
                if (i < Object.keys(options.values).length - 1) {
                    query = query + ",";
                }
                break;
            case "string":
                query = query + "'" + options.values[field].replace("'", "") + "'";
                if (i < Object.keys(options.values).length - 1) {
                    query = query + ",";
                }
                break;
            case "object":
                if (options.values[field] instanceof Date) {
                    query = query + "'" + moment(options.values[field]).format("Y-MM-DD HH:mm:ss") + "'";
                } else {
                    query = query + "'" + JSON.stringify(options.values[field]) + "'";
                }
                if (i < Object.keys(options.values).length - 1) {
                    query = query + ",";
                }
                break;
            case "undefined":
                break;
        }
    }
    if (query.lastIndexOf(',') + 1 == query.length) {
        query = query.substr(0, query.length - 1)
    }
    query = query + ")";

    return db.get().query(query, callback);

}


exports.updateProject = function (options, callback) {

    if (typeof (options) === "undefined" && typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Update Project expects an option Object and a callback."))
    }

    // Campo SET
    query = "UPDATE project SET ";
    for (var i = 0; i < Object.keys(options.set).length; i++) {
        var field = Object.keys(options.set)[i];

        switch (typeof (options.set[field])) {
            case "number":
                query = query + field + "=" + options.set[field];

                if (i < Object.keys(options.set).length - 1) {
                    query = query + ",";
                }
                break;
            case "string":
                query = query + field + "='" + options.set[field].replace("'", "") + "'";

                if (i < Object.keys(options.set).length - 1) {
                    query = query + ",";
                }
                break;
            case "object":
                if (options.set[field] instanceof Date) {
                    query = query + field + "='" + moment(options.set[field]).format("YYYY-MM-DD") + "'";
                } else {
                    query = query + field + "='" + JSON.stringify(options.set[field]) + "'";
                }
                if (i < Object.keys(options.set).length - 1) {
                    query = query + ",";
                }
                break;
            case "undefined":
                break;
        }
    }

    // Campo WHERE
    query = query + " WHERE ";
    for (var i = 0; i < Object.keys(options.where).length; i++) {
        var field = Object.keys(options.where)[i];

        query = query + field + "='" + options.where[field] + "'";

        if (i < Object.keys(options.where).length - 1) {
            query = query + " AND ";
        }
    }

    return db.get().query(query, callback);

}

exports.findProject = function (options, callback) {

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
        order: {}
    }, options);

    query = "SELECT " + options.select.join(",") + " FROM project ";

    if (Object.keys(options.where).length) {
        query = query + " WHERE ";
        for (var i = 0; i < Object.keys(options.where).length; i++) {
            var field = Object.keys(options.where)[i];

            query = query + field + "='" + options.where[field] + "'";

            if (i < Object.keys(options.where).length - 1) {
                query = query + " AND ";
            }
        }
    }

    if (Object.keys(options.order).length) {
        query = query + " ORDER BY ";
        for (var i = 0; i < Object.keys(options.order).length; i++) {
            var field = Object.keys(options.order)[i];

            query = query + field + " " + options.order[field];

            if (i < Object.keys(options.where).length - 1) {
                query = query + " , ";
            }
        }
    }

    return db.get().query(query, callback);

}


exports.findActiveProject = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Find Active Projects expects an option Object and a callback."))
    }

    query = "SELECT * FROM project WHERE status != 'closed'"

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

        if (i < Object.keys(options.where).length - 1) {
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

exports.deleteUser = function (user, callback) {

    query = "DELETE FROM user WHERE id=" + user.id;

    console.log(query);

    return db.get().query(query, callback);

}

exports.saveUserLogin = function (user, callback) {

    query = "UPDATE user SET last_login='" + moment().format("Y-MM-DD HH:mm:ss") + "' WHERE id=" + user.id;
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

exports.getAreaType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get area_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM area_type"

    return db.get().query(query, callback);

}

exports.getCableRoutingInstall = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cable_routing_install expects an option Object and a callback."))
    }

    query = "SELECT * FROM cable_routing_install"

    return db.get().query(query, callback);

}

exports.getCablingRouting = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing expects an option Object and a callback."))
    }

    query = "SELECT * FROM cabling_routing"

    return db.get().query(query, callback);

}

exports.getCablingRoutingType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM cabling_routing_type"

    return db.get().query(query, callback);

}

exports.getContractDuration = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM contract_duration"

    return db.get().query(query, callback);

}

exports.getContractType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM contract_type"

    return db.get().query(query, callback);

}

exports.getEvcInstallation = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM evc_installation"

    return db.get().query(query, callback);

}

exports.getEvcScore = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM evc_score"

    return db.get().query(query, callback);

}

exports.getProponentType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM proponent_type"

    return db.get().query(query, callback);

}

exports.getSiteType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get cabling_routing_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM site_type"

    return db.get().query(query, callback);

}

exports.getInstallType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get installation_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM installation_type"

    return db.get().query(query, callback);

}

exports.getAccessType = function (callback) {

    if (typeof (callback) === "undefined") {
        return callback(new Error("invalid argument. Get access_type expects an option Object and a callback."))
    }

    query = "SELECT * FROM access_type"

    return db.get().query(query, callback);

}
