# 📦 @scaleleap/pg-format

A fully typed TypeScript and Node.js implementation of
[PostgreSQL format()](http://www.postgresql.org/docs/9.3/static/functions-string.html#FUNCTIONS-STRING-FORMAT)
to safely create dynamic SQL queries. SQL identifiers and literals are escaped to help prevent SQL
injection.

The behavior is equivalent to
[PostgreSQL format()](http://www.postgresql.org/docs/9.3/static/functions-string.html#FUNCTIONS-STRING-FORMAT).
This package also supports Node buffers, arrays, and objects which is explained [below](#arrobject).

This package is a derivative of prior art. See Authors or Acknowledgments section below for details.

---

This package does one, two and three.

## Download & Installation

```sh
npm i -s @scaleleap/pg-format
```

## Example

```ts
import { format } from '@scaleleap/pg-format'
const sql = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10')
console.log(sql); // SELECT * FROM my_table WHERE my_col = 34 LIMIT 10
```

## API

### format(fmt, ...)

Returns a formatted string based on ```fmt``` which has a style similar to the C function ```sprintf()```.

* ```%%``` outputs a literal ```%``` character.
* ```%I``` outputs an escaped SQL identifier.
* ```%L``` outputs an escaped SQL literal.
* ```%s``` outputs a simple string.

#### Argument position

You can define where an argument is positioned using ```n$``` where ```n``` is the argument index
starting at 1.

```ts
import { format } from '@scaleleap/pg-format'
const sql = format('SELECT %1$L, %1$L, %L', 34, 'test')
console.log(sql); // SELECT 34, 34, 'test'
```

### format.config(cfg)

Changes the global configuration. You can change which letters are used to denote identifiers,
literals, and strings in the formatted string. This is useful when the formatted string contains a
PL/pgSQL function which calls [PostgreSQL format()](http://www.postgresql.org/docs/9.3/static/functions-string.html#FUNCTIONS-STRING-FORMAT)
itself.

```ts
import { config } from '@scaleleap/pg-format'
config({
    pattern: {
        ident: 'V',
        literal: 'C',
        string: 't'
    }
})
config() // reset to default
```

### format.ident(input)

Returns the input as an escaped SQL identifier string. `undefined`, ```null```, and objects will
throw an error.

### format.literal(input)

Returns the input as an escaped SQL literal string. ```undefined``` and ```null``` will return
```'NULL'```;

### format.string(input)

Returns the input as a simple string. ```undefined``` and ```null``` will return an empty string.
If an array element is ```undefined``` or ```null```, it will be removed from the output string.

### format.withArray(fmt, array)

Same as ```format(fmt, ...)``` except parameters are provided in an array rather than as function
arguments. This is useful when dynamically creating a SQL query and the number of parameters is
unknown or variable.

## Node Buffers

Node buffers can be used for literals (```%L```) and strings (```%s```), and will be converted to
[PostgreSQL bytea hex format](http://www.postgresql.org/docs/9.3/static/datatype-binary.html).

## Arrays and Objects

For arrays, each element is escaped when appropriate and concatenated to a comma-delimited string.
Nested arrays are turned into grouped lists (for bulk inserts), e.g. `[['a', 'b'], ['c', 'd']]`
turns into `('a', 'b'), ('c', 'd')`. Nested array expansion can be used for literals (```%L```) and
strings (```%s```), but not identifiers (```%I```).

For objects, ```JSON.stringify()``` is called and the resulting string is escaped if appropriate.
Objects can be used for literals (```%L```) and strings (```%s```), but not identifiers (```%I```).
See the example below.

```ts
import { format } from '@scaleleap/pg-format'

const myArray = [ 1, 2, 3 ]
const myObject = { a: 1, b: 2 }
const myNestedArray = [['a', 1], ['b', 2]]

let sql = format('SELECT * FROM t WHERE c1 IN (%L) AND c2 = %L', myArray, myObject)
console.log(sql) // SELECT * FROM t WHERE c1 IN (1,2,3) AND c2 = '{"a":1,"b":2}'

sql = format('INSERT INTO t (name, age) VALUES %L', myNestedArray)
console.log(sql) // INSERT INTO t (name, age) VALUES ('a', 1), ('b', 2)
```

## Contributing

This repository uses [Conventional Commit](https://www.conventionalcommits.org/) style commit messages.

## Authors or Acknowledgments

* [TJ Holowaychuk](https://github.com/tj) for the original
  [pg-escape](https://github.com/segmentio/pg-escape)
* [Datalanche, Inc](https://github.com/datalanche/node-pg-format) for
  [pg-format](https://github.com/datalanche/node-pg-format)
* [Clint Phillips](https://github.com/cphillips/node-pg-format) for
  [node-pg-format](https://github.com/cphillips/node-pg-format), a TypeScript port of `pg-format`
  package. I borrowed most of the TypeScript code from `node-pg-format`.
* [Roman Filippov](https://github.com/moltar) and
  [Scale Leap](https://www.scaleleap.com) for this package.

## License

This project is licensed under the MIT License.

## Badges

[![NPM](https://img.shields.io/npm/v/@scaleleap/pg-format)](https://npm.im/@scaleleap/pg-format)
[![License](https://img.shields.io/npm/l/@scaleleap/pg-format)](./LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ScaleLeap/pg-format/CI)](https://github.com/ScaleLeap/pg-format/actions)
[![Codecov](https://img.shields.io/codecov/c/github/scaleleap/typescript-template)](https://codecov.io/gh/ScaleLeap/pg-format)
[![Snyk](https://img.shields.io/snyk/vulnerabilities/github/scaleleap/typescript-template)](https://snyk.io/test/github/scaleleap/typescript-template)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
