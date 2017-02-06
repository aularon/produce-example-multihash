'use strict'

const crypto = require('crypto')
// const supprtedHashes = crypto.getHashes()
const supprtedHashes = ['md5', 'sha1', 'sha512']

module.exports = {
  // Takes a source path and returns possible targets
  sourceTargets: fname => fname.endsWith('.js') ? supprtedHashes.map(hash => fname + '.' + hash) : null,
  // Takes a target path and returns possible sources
  targetSources: fname => [fname.replace(/\.js\.(md5|sha1|sha512)$/, '.js')],
  // functions to process input
  via: [
    {
      stream: function () {
        var hashName = this.output.relPath.split('.').pop()
        return crypto.createHash(hashName)
      }
    },
    (buf) => buf.toString('hex') + '\n'
  ]
}
