var request = require('request');

const fs = require('fs');

class HigecoPortalDriver {

    constructor(config) {

        this.config = config;
        this.endpoint = this.config.higecoAPI.endpoint;
        this.username = this.config.higecoAPI.username;
        this.password = this.config.higecoAPI.password;
        this.authtoken = "";

        // GET AUTH TOKEN
        this.getToken(this.username, this.password, function (err, token) {
            higeco_driver.authtoken = token;

            // REFRESH DATA EACH 15mins
            higeco_driver.refreshData();
        });

    }


    getToken(username, password, callback) {

        request.post({
            headers: { 'content-type': 'application/json' },
            url: this.endpoint + '/api/v1/authenticate/',
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

    getMeasurements(data, callback) {

        request.get({
            headers: {
                'authorization': this.authtoken
            },
            url: this.endpoint + '/api/v1/getLogData/' + data.plant.plant_id + "/" + data.plant.device_id + "/" + data.plant.log_id + "/" + data.plant.item_id //+ "?from=" + data.from.getTime() / 1000 + "&to=" + data.to.getTime() / 1000
        }, function (err, res, body) {
            if (err) return callback(err, null)
            if (res.statusCode !== 200) return callback(res.statusMessage, null)
            var result = JSON.parse(body);
            var path = res.request.path.split("/");
            result['plant_id'] = path[4];
            result['device_id'] = path[5];
            return callback(null, result);
        });

    }

    refreshData(callback) {

        var me = this;

        logger.log("START GET MEASUREMENTS");

        models.plants.findAll().then(plants => {

            async.forEachOf(plants, function (value, key, callback) {
                updateMeasurements(me, { plant: value, from: new Date(2018, 10, 1), to: new Date(2018, 10, 20) }, function () {
                    return callback();
                });
            }, function (err) {
                if (err) return logger.log("GET MEASUREMENTS - NOT OK: " + err);
                return logger.log("GET MEASUREMENTS - OK");
            });

        });

        setTimeout(function () {

            higeco_driver.refreshData();

        }, (this.config.higecoAPI.refreshPeriod));

    }
}

function updateMeasurements(higeco_driver, filter, callback) {

    higeco_driver.getMeasurements(filter, function (err, resp) {

        if (err) return logger.log(err);
        // IF NO RESULTS -> EXIT
        if (!resp.data) return logger.log("NO DATA");
        if (resp.data.length === 0) return logger.log("NO DATA");

        var plant_id = resp.plant_id;
        var device_id = resp.device_id;

        // UPDATE OR CREATE RECORDS
        async.forEachOf(resp.items, function (value, key, callback) {
            var item = value;
            async.forEachOf(resp.data, function (value, key, callback) {

                if (value[1] === '#E3') {
                    value[1] = null; 
                }

                var data = {
                    item_id: item.id,
                    plant_id: plant_id,
                    timestamp: moment.unix(value[0]).utc().toDate(),
                    value: value[1]
                }

                models.measurements.findOrCreate({ where: { timestamp: data.timestamp, plant_id: plant_id, item_id: data.item_id } })
                    .spread((record, created) => {
                        record.updateAttributes(data);
                        return callback();
                    })
                    .catch(function (error) {
                        return callback(error);
                    });

            }, function (err) {
                if (err) return callback(err)
                return callback();
            });
        }, function (err) {
            if (err) return callback(err)
            return callback();
        });
    });

}

module.exports = HigecoPortalDriver;
