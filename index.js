"use strict";

const async = require('async');
const ds18b20 = require('ds18b20');
const ThingSpeakClient = require('thingspeakclient');

const REPEAT_INTERVAL = 300000;
const CHANNEL_ID = 0;
const WRITE_API_KEY = '';

function reportTemp() {
    ds18b20.sensors(function(err, ids) {
        let tsc = new ThingSpeakClient(),
            id = ids.shift();

        tsc.attachChannel(CHANNEL_ID, { writeKey: WRITE_API_KEY }, function() {
            ds18b20.temperature(id, {parser: 'hex'}, function(err, value) {
                tsc.updateChannel(CHANNEL_ID, {field1: value.toFixed(2)}, function(err, resp) {
                    if (!err && resp > 0) {
                        console.log('update successfully. Entry number was: ' + resp);
                    } else {
                        console.log('Update error.');
                    }
                });
            });
        });
    });
}

async.forever(next => {
    reportTemp();

    setTimeout(next, REPEAT_INTERVAL);
}, error => {
    console.log(error);
});
