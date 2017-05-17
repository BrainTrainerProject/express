/* import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha'; */
import { describe, it } from 'mocha';
import Dog from '../dog';

const assert = require('chai').assert;

describe('Dog', () => {
  describe('bark()', () => {
    it('bark should include the name', () => {
      const result = new Dog('Test').bark();
      assert.equal(result, 'Wah wah, I am Test');
    });

    it('bark should return type string', () => {
      const result = new Dog('Test').bark();
      assert.typeOf(result, 'string');
    });
  });

  describe('pee()', () => {
    it('pee should return true', () => {
      const result = new Dog('Test').pee();
      assert.typeOf(result, 'boolean');
    });
  });
});
