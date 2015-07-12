var express = require('express');
var EventStore = require('event-store-client');
var app = express();

var PORT = process.env.PORT || 8081;
var EVENTSTORE_HOST = process.env.EVENTSTORE_HOST || '192.168.59.103';
var EVENTSTORE_PORT = process.env.EVENTSTORE_PORT || 2113

var health = {
  eventStore: {
    healthy: false,
    status: 'EventStore connection not initialized'
  }
}

var options = {
  host: EVENTSTORE_HOST,
  onConnect: function () {
    health.eventStore.healthy = true;
    health.eventStore.status = '';
  },
  onError: function () {
    health.eventStore.status = 'Could not connect to EventStore'
  }
}

var connection = new EventStore.Connection(options)
var credentials = {
  username: 'admin',
  password: 'changeit'
}

app.get('/', function (req, res) {
  connection.readStreamEventsForward('emails', 0, 10, false, false,
    null, credentials, function(result) {
      res.send(result.events)
    });
});

app.get('/_health/level/0', function (req, res) {
  if (health.eventStore.healthy) return res.send({
      success: true
    });

  else return res.status(500).send({
    success: false,
    error: health.eventStore.status
  });

});

app.listen(PORT, function () {
  console.log('Email-parser is running on port ' + PORT);
});
