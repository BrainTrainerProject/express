'use strict';

var _mocha = require('mocha');

var _dog = require('../dog');

var _dog2 = _interopRequireDefault(_dog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha'; */
var assert = require('chai').assert;

(0, _mocha.describe)('Dog', function () {
  (0, _mocha.describe)('bark()', function () {
    (0, _mocha.it)('bark should include the name', function () {
      var result = new _dog2.default('Test').bark();
      assert.equal(result, 'Wah wah, I am Test');
    });

    (0, _mocha.it)('bark should return type string', function () {
      var result = new _dog2.default('Test').bark();
      assert.typeOf(result, 'string');
    });
  });

  (0, _mocha.describe)('pee()', function () {
    (0, _mocha.it)('pee should return true', function () {
      var result = new _dog2.default('Test').pee();
      assert.typeOf(result, 'boolean');
    });
  });
});