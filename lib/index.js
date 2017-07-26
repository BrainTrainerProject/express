'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _websocket = require('./websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _mobileNotifier = require('./mobile-notifier');

var _mobileNotifier2 = _interopRequireDefault(_mobileNotifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = require('./config.json');

var app = (0, _express2.default)();
var server = _http2.default.Server(app);

app.use((0, _cors2.default)());
app.use(_express2.default.static('lib/public'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use((0, _morgan2.default)('combined', { immediate: true }));

app.set('port', process.env.PORT || conf.port);

app.post('/echo', function (req, res) {
  res.send(req.body);
});

app.use('/api', _router2.default);
_websocket2.default.createApplication(server);
_mobileNotifier2.default.startProcess();

_btMongodb2.default.connect(conf.mongodb, function (err) {
  if (err) {
    console.log('Unable to connect to MongoDB');
    process.exit(1);
  } else {
    server.listen(app.get('port'), function () {
      console.log('Server is listening on port ' + app.get('port'));
    });
  }
});

module.exports = app;