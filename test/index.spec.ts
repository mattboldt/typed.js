var assert = require('assert')
var expect = require('expect')
import Typed from '../src'

describe('Typed', function() {
  describe('#constructor()', function() {
    it('should return an instance of typed', function() {
      expect(new Typed('')).to.be.an.instanceof(Typed)
    })
  })
})
