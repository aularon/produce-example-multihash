'use strict'

const produce = require('produce')

var produceOptions = require('./src/produceOptions')
produceOptions.target = new produce.HTTPTarget({port: 9001})

var p = new produce.Produce(produceOptions)

p.run()
