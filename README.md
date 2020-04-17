# imicros-rules
[![Build Status](https://travis-ci.org/al66/imicros-rules.svg?branch=master)](https://travis-ci.org/al66/imicros-rules)
[![Coverage Status](https://coveralls.io/repos/github/al66/imicros-rules/badge.svg?branch=master)](https://coveralls.io/github/al66/imicros-rules?branch=master)

[Moleculer](https://github.com/moleculerjs/moleculer) service for rulesset execution

Uses [imicros-rules-compiler](https://github.com/al66/imicros-rules-compiler) as rules intepreter.

## Installation
```
$ npm install imicros-rules --save
```
## Dependencies
Required mixins (or a similar mixin with the same notation):
- [imicros-acl](https://github.com/al66/imicros-acl)
- [imciros-minio](https://github.com/al66/imicros-minio)

# Usage
## Usage rules service
```js
const { ServiceBroker } = require("moleculer");
const { AclMixin } = require("imicros-acl");
const { MinioMixin } = require("imicros-minio");
const { Rules } = require("imicros-rules");

broker = new ServiceBroker({
    logger: console
});
broker.createService(Rules, Object.assign({ 
    mixins: [MinioMixin(), AclMixin]
}));
broker.start();
```
## Actions rules service
- eval { name, data } => result  

### Example eval
```js
// path/to/ruleset/test.rules: "@@ @ user.age :: >= 16 & <= 35 => result := 'true' @@"
let params = {
	name: "path/to/ruleset/test.rules",
	data: { user: { age: 25 } }
};
let res = await broker.call("rules.eval", params, opts)
// res = { result: 'true' }
```
