# produce-example-multihash
Uses [`produce`](https://github.com/etabits/node-produce) to create multiple hashes of files in a directory

## Setup
```sh
git clone https://github.com/aularon/produce-example-multihash
cd produce-example-multihash/
npm install
```

## Understand
Every `produce` is defined by three elements:

1. `source`
2. `target`
3. A collection of `rules`

Every rule is defined by the following elements:

1. `sourceTargets`: a function that takes source path and return targets that are to be created from this resource. Used when production is source-initiated, like with a filesystem target (example in build script).
2. `targetSources`: a function that takes target path and return possible source candidates for that file. Used when production is target-initiated, like with an HTTP target (example in server script).
3. `via`: an array of consecutive functions used to process input and create output, can be [sync/async/promise or stream based](https://github.com/etabits/node-line)

In the [produceOptions.js](https://github.com/aularon/produce-example-multihash/blob/master/src/produceOptions.js) and [rule-hash.js](https://github.com/aularon/produce-example-multihash/blob/master/src/rule-hash.js), we define the following options:

```js
var produceOptions = {
  source: new FileSystemSource('./src'),
  rules: [
    {
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
  ]
}
```
## Same source, multiple targets, or vice versa
After defining common source and rules, we can use produce with different targets:

### build.js
This script takes the options above, and plugs a filesystem target to them, then runs produce:
```js
produceOptions.target = new FileSystemTarget('./hashed')
var p = new Produce(produceOptions)

p.run()
```
This will loop the files in source directory (`source: new FileSystemSource('./src')`), and create three output files for each (because `sourceTargets` returns an array of three elements, one for each of the three supported hashes).

[![Example TTY GIF for build script](https://aularon.github.io/produce-example-multihash/build.gif)](https://aularon.github.io/produce-example-multihash/build.gif)

### serve.js
This script is almost identical to that of build.js, except for that it plugs and http target:
```js
produceOptions.target = new produce.HTTPTarget({port: 9001})
var p = new produce.Produce(produceOptions)

p.run()
```
When run, it starts listening on port 9001 for connections. For an example request of [http://localhost:9001/rule-hash.js.md5](http://localhost:9001/rule-hash.js.md5), produce will check every rule's `targetSources` for possible source candidates, our rule above will return `rule.hash.js` as the only possible candidate, which produce will read, pass into the `.via` function, and then send the result to the HTTPTarget, which will send it back to the client in turn.

[![Example TTY GIF for serve script](https://aularon.github.io/produce-example-multihash/serve.gif)](https://aularon.github.io/produce-example-multihash/serve.gif)
