'use strict'

const Produce = require('produce').Produce

var produceOptions = require('./src/produceOptions')
produceOptions.target = './hashed'

var p = new Produce(produceOptions)

p.run()
