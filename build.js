'use strict'

const Produce = require('produce').Produce
const FileSystemTarget = require('produce').FileSystemTarget

var produceOptions = require('./src/produceOptions')
produceOptions.target = new FileSystemTarget('./hashed')

var p = new Produce(produceOptions)

p.run()
