var express = require('express');
var multer = require('multer');
var EventStore = require('event-store-client');
var ExpectedVersion = EventStore.ExpectedVersion;

var PORT = process.env.PORT || 8080;
var EVENTSTORE_HOST = process.env.EVENTSTORE_HOST || '192.168.59.103';
var EVENTSTORE_PORT = process.env.EVENTSTORE_PORT || 2113

var app = express();
app.use(multer());

var options = {
  host: EVENTSTORE_HOST
}

var connection = new EventStore.Connection(options)
var credentials = {
  username: 'admin',
  password: 'changeit'
}

function saveMailEvent (event, callback) {
  connection.writeEvents('emails', ExpectedVersion.Any, false,  [event],
    credentials, function (completed) {
      console.log('Events written result: ' + EventStore.OperationResult.getName(completed.result));
      if (completed.error) {
        callback(completed.error);
      } else {
        callback(null, completed.result);
      }
    });
}

function createGuid () {
  return EventStore.Connection.createGuid();
}

function createEvent(payload) {
  return {
    eventId: createGuid(),
    eventType: 'mail/sendgrid+unstable',
    data: payload
  }
}

app.get('/_health/level/0', function (req, res) {
  res.send({
    success: true
  });
});

app.post('/', function (req, res) {
  var payload = req.body;
  var event = createEvent(payload);
  saveMailEvent(event, function (err) {
    if (err) return res.status(500).send({success: false})
    res.send({success: true});
  });
});

app.listen(PORT, function() { console.log('running'); });
