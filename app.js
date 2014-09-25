'use strict';

var fs = require('fs');
var https = require('https');

var HIPCHAT_API_KEY = process.env.HIPCHAT_API_KEY;
if (!HIPCHAT_API_KEY) {
    console.log('Please set the HIPCHAT_API_KEY environment variable.');
    process.exit(-1);
}

var DATA_FILE = 'presence.csv';

function makeRequest(options, callback) {
    var req = https.request(options, function (res) {
        if (res.statusCode !== 200) {
            callback(res.statusCode);
        } else {
            var buffer = '';
            res.on('data', function (chunk) {
                buffer += chunk;
            });
            res.on('end', function () {
                callback(null, JSON.parse(buffer));
            });
        }
    });
    req.end();
    req.on('error', function (err) {
        callback(err);
    });
}

function listUsers(callback) {
    var options = {};
    options.host = 'api.hipchat.com';
    options.method = 'GET';
    options.path = '/v1/users/list?auth_token=' + HIPCHAT_API_KEY;
    makeRequest(options, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data.users);
        }
    });
}

function recordUsers() {
    listUsers(function(err, users) {
        var i;
        if (err) {
            console.log(err);
        } else {
            var timestamp = Math.round(+new Date() / 1000);
            var rows = [];
            for (i = 0; i < users.length; i += 1) {
                var user = users[i];
                rows.push(timestamp + ',' + user.email + ',' + user.status);
            }
            var data = rows.join('\n') + '\n';
            fs.appendFile(DATA_FILE, data, function (err) {
                if (err) {
                    console.log('WARN: Cannot log data to file.', err);
                }
            });
            // Log to the console.
            var availableUsers = [];
            for (i = 0; i < users.length; i += 1) {
                if (users[i].status === 'available') {
                    availableUsers.push(users[i].email);
                }
            }
            console.log(timestamp, availableUsers.join(', '));
        }
    });
}

console.log('Recording presence in presence.csv file');
// Immediately record users when starting up.
recordUsers();
// Then, every 5 minutes.
setInterval(recordUsers, 5 * 60 * 1000);
