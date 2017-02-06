'use strict'

var FileSystemSource = require('produce').FileSystemSource

module.exports = {
  source: new FileSystemSource('./src'),
  rules: [
    require('./rule-hash')
  ]
}
