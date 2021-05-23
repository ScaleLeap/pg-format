/* eslint-disable radar/no-duplicate-string, eslint-comments/disable-enable-pair */

//
// Original source from https://github.com/segmentio/pg-escape
//
import { format, ident, literal, string, withArray } from './pg-format'

const NULL = JSON.parse('null')

const testDate = new Date(Date.UTC(2012, 11, 14, 13, 6, 43, 152))
const testArray = [
  'abc',
  1,
  true,
  NULL,
  testDate,
  Number.NEGATIVE_INFINITY,
  Number.POSITIVE_INFINITY,
  Number.NaN,
  1n,
]
const testIdentArray = [
  'abc',
  'AbC',
  1,
  true,
  testDate,
  Number.NEGATIVE_INFINITY,
  Number.POSITIVE_INFINITY,
  Number.NaN,
  1n,
]
const testObject = { a: 1, b: 2 }
const testNestedArray = [
  [1, 2],
  [3, 4],
  [5, 6],
]

describe('format(fmt, ...)', () => {
  describe('%s', () => {
    it('should format as a simple string', () => {
      expect.assertions(2)

      expect(format('some %s here', 'thing')).toStrictEqual('some thing here')
      expect(format('some %s thing %s', 'long', 'here')).toStrictEqual('some long thing here')
    })

    it('should format array of array as simple string', () => {
      expect.assertions(1)

      expect(format('many %s %s', 'things', testNestedArray)).toStrictEqual(
        'many things (1, 2), (3, 4), (5, 6)',
      )
    })

    it('should format string using position field', () => {
      expect.assertions(6)

      expect(format('some %1$s', 'thing')).toStrictEqual('some thing')
      expect(format('some %1$s %1$s', 'thing')).toStrictEqual('some thing thing')
      expect(format('some %1$s %s', 'thing', 'again')).toStrictEqual('some thing again')
      expect(format('some %1$s %2$s', 'thing', 'again')).toStrictEqual('some thing again')
      expect(format('some %1$s %2$s %1$s', 'thing', 'again')).toStrictEqual(
        'some thing again thing',
      )
      expect(format('some %1$s %2$s %s %1$s', 'thing', 'again', 'some')).toStrictEqual(
        'some thing again some thing',
      )
    })

    it('should not format string using position 0', () => {
      expect.assertions(1)

      expect(() => format('some %0$s', 'thing')).toThrow(Error)
    })

    it('should not format string using position field with too few arguments', () => {
      expect.assertions(1)

      expect(() => format('some %2$s', 'thing')).toThrow(Error)
    })
  })

  describe('%%', () => {
    it('should format as %', () => {
      expect.assertions(1)

      expect(format('some %%', 'thing')).toStrictEqual('some %')
    })

    it('should not eat args', () => {
      expect.assertions(1)

      expect(format('just %% a %s', 'test')).toStrictEqual('just % a test')
    })

    it('should not format % using position field', () => {
      expect.assertions(1)

      expect(format('%1$%', 'thing')).toStrictEqual('%1$%')
    })
  })

  describe('%I', () => {
    it('should format as an identifier', () => {
      expect.assertions(1)

      expect(format('some %I', 'foo/bar/baz')).toStrictEqual('some "foo/bar/baz"')
    })

    it('should not format array of array as an identifier', () => {
      expect.assertions(1)

      expect(() => format('many %I %I', 'foo/bar/baz', testNestedArray)).toThrow(Error)
    })

    it('should format identifier using position field', () => {
      expect.assertions(6)

      expect(format('some %1$I', 'thing')).toStrictEqual('some thing')
      expect(format('some %1$I %1$I', 'thing')).toStrictEqual('some thing thing')
      expect(format('some %1$I %I', 'thing', 'again')).toStrictEqual('some thing again')
      expect(format('some %1$I %2$I', 'thing', 'again')).toStrictEqual('some thing again')
      expect(format('some %1$I %2$I %1$I', 'thing', 'again')).toStrictEqual(
        'some thing again thing',
      )
      expect(format('some %1$I %2$I %I %1$I', 'thing', 'again', 'huh')).toStrictEqual(
        'some thing again huh thing',
      )
    })

    it('should not format identifier using position 0', () => {
      expect.assertions(1)

      expect(() => format('some %0$I', 'thing')).toThrow(Error)
    })

    it('should not format identifier using position field with too few arguments', () => {
      expect.assertions(1)

      expect(() => format('some %2$I', 'thing')).toThrow(Error)
    })
  })

  describe('%L', () => {
    it('should format as a literal', () => {
      expect.assertions(1)

      expect(format('%L', "Tobi's")).toStrictEqual("'Tobi''s'")
    })

    it('should format array of array as a literal', () => {
      expect.assertions(1)

      expect(format('%L', testNestedArray)).toStrictEqual('(1, 2), (3, 4), (5, 6)')
    })

    it('should format literal using position field', () => {
      expect.assertions(6)

      expect(format('some %1$L', 'thing')).toStrictEqual("some 'thing'")
      expect(format('some %1$L %1$L', 'thing')).toStrictEqual("some 'thing' 'thing'")
      expect(format('some %1$L %L', 'thing', 'again')).toStrictEqual("some 'thing' 'again'")
      expect(format('some %1$L %2$L', 'thing', 'again')).toStrictEqual("some 'thing' 'again'")
      expect(format('some %1$L %2$L %1$L', 'thing', 'again')).toStrictEqual(
        "some 'thing' 'again' 'thing'",
      )
      expect(format('some %1$L %2$L %L %1$L', 'thing', 'again', 'some')).toStrictEqual(
        "some 'thing' 'again' 'some' 'thing'",
      )
    })

    it('should not format literal using position 0', () => {
      expect.assertions(1)

      expect(() => format('some %0$L', 'thing')).toThrow(Error)
    })

    it('should not format literal using position field with too few arguments', () => {
      expect.assertions(1)

      expect(() => format('some %2$L', 'thing')).toThrow(Error)
    })
  })
})

describe('withArray (fmt, args)', () => {
  describe('%s', () => {
    it('should format as a simple string', () => {
      expect.assertions(2)

      expect(withArray('some %s here', ['thing'])).toStrictEqual('some thing here')
      expect(withArray('some %s thing %s', ['long', 'here'])).toStrictEqual('some long thing here')
    })

    it('should format array of array as simple string', () => {
      expect.assertions(1)

      expect(withArray('many %s %s', ['things', testNestedArray])).toStrictEqual(
        'many things (1, 2), (3, 4), (5, 6)',
      )
    })
  })

  describe('%%', () => {
    it('should format as %', () => {
      expect.assertions(1)

      expect(withArray('some %%', ['thing'])).toStrictEqual('some %')
    })

    it('should not eat args', () => {
      expect.assertions(2)

      expect(withArray('just %% a %s', ['test'])).toStrictEqual('just % a test')
      expect(withArray('just %% a %s %s %s', ['test', 'again', 'and again'])).toStrictEqual(
        'just % a test again and again',
      )
    })
  })

  describe('%I', () => {
    it('should format as an identifier', () => {
      expect.assertions(2)

      expect(withArray('some %I', ['foo/bar/baz'])).toStrictEqual('some "foo/bar/baz"')
      expect(withArray('some %I and %I', ['foo/bar/baz', '#hey'])).toStrictEqual(
        'some "foo/bar/baz" and "#hey"',
      )
    })

    it('should not format array of array as an identifier', () => {
      expect.assertions(1)

      expect(() => withArray('many %I %I', ['foo/bar/baz', testNestedArray])).toThrow(Error)
    })
  })

  describe('%L', () => {
    it('should format as a literal', () => {
      expect.assertions(2)

      expect(withArray('%L', ["Tobi's"])).toStrictEqual("'Tobi''s'")
      expect(withArray('%L %L', ["Tobi's", 'birthday'])).toStrictEqual("'Tobi''s' 'birthday'")
    })

    it('should format array of array as a literal', () => {
      expect.assertions(1)

      expect(withArray('%L', [testNestedArray])).toStrictEqual('(1, 2), (3, 4), (5, 6)')
    })
  })
})

describe('string(val)', () => {
  it('should coerce to a string', () => {
    expect.assertions(14)

    expect(string()).toStrictEqual('')
    expect(string(NULL)).toStrictEqual('')
    expect(string(true)).toStrictEqual('t')
    expect(string(false)).toStrictEqual('f')
    expect(string(0)).toStrictEqual('0')
    expect(string(15)).toStrictEqual('15')
    expect(string(-15)).toStrictEqual('-15')
    expect(string(45.13)).toStrictEqual('45.13')
    expect(string(-45.13)).toStrictEqual('-45.13')
    expect(string('something')).toStrictEqual('something')
    expect(string(testArray)).toStrictEqual(
      'abc,1,t,2012-12-14 13:06:43.152+00,-Infinity,Infinity,NaN,1',
    )
    expect(string(testNestedArray)).toStrictEqual('(1, 2), (3, 4), (5, 6)')
    expect(string(testDate)).toStrictEqual('2012-12-14 13:06:43.152+00')
    expect(string(testObject)).toStrictEqual('{"a":1,"b":2}')
  })
})

describe('ident(val)', () => {
  it('should quote when necessary', () => {
    expect.assertions(5)

    expect(ident('foo')).toStrictEqual('foo')
    expect(ident('_foo')).toStrictEqual('_foo')
    expect(ident('_foo_bar$baz')).toStrictEqual('_foo_bar$baz')
    expect(ident('test.some.stuff')).toStrictEqual('"test.some.stuff"')
    expect(ident('test."some".stuff')).toStrictEqual('"test.""some"".stuff"')
  })

  it('should quote reserved words', () => {
    expect.assertions(3)

    expect(ident('desc')).toStrictEqual('"desc"')
    expect(ident('join')).toStrictEqual('"join"')
    expect(ident('cross')).toStrictEqual('"cross"')
  })

  it('should quote', () => {
    expect.assertions(10)

    expect(ident(true)).toStrictEqual('"t"')
    expect(ident(false)).toStrictEqual('"f"')
    expect(ident(0)).toStrictEqual('"0"')
    expect(ident(15)).toStrictEqual('"15"')
    expect(ident(-15)).toStrictEqual('"-15"')
    expect(ident(45.13)).toStrictEqual('"45.13"')
    expect(ident(-45.13)).toStrictEqual('"-45.13"')
    expect(ident(testIdentArray)).toStrictEqual(
      'abc,"AbC","1","t","2012-12-14 13:06:43.152+00","-Infinity","Infinity","NaN","1"',
    )
    expect(() => ident(testNestedArray)).toThrow(Error)
    expect(ident(testDate)).toStrictEqual('"2012-12-14 13:06:43.152+00"')
  })

  it('should throw when undefined', () => {
    expect.assertions(1)

    expect(() => ident()).toThrow(/SQL identifier cannot be null or undefined/)
  })

  it('should throw when null', () => {
    expect.assertions(1)

    expect(() => ident(NULL)).toThrow(/SQL identifier cannot be null or undefined/)
  })

  it('should throw when object', () => {
    expect.assertions(1)

    expect(() => ident({})).toThrow(/SQL identifier cannot be an object/)
  })
})

describe('literal(val)', () => {
  it('should return NULL for null', () => {
    expect.assertions(2)

    expect(literal(NULL)).toStrictEqual('NULL')
    expect(literal()).toStrictEqual('NULL')
  })

  it('should quote', () => {
    expect.assertions(12)

    expect(literal(true)).toStrictEqual("'t'")
    expect(literal(false)).toStrictEqual("'f'")
    expect(literal(0)).toStrictEqual('0')
    expect(literal(15)).toStrictEqual('15')
    expect(literal(-15)).toStrictEqual('-15')
    expect(literal(45.13)).toStrictEqual('45.13')
    expect(literal(-45.13)).toStrictEqual('-45.13')
    expect(literal('hello world')).toStrictEqual("'hello world'")
    expect(literal(testArray)).toStrictEqual(
      "'abc',1,'t',NULL,'2012-12-14 13:06:43.152+00','-Infinity','Infinity','NaN',1",
    )
    expect(literal(testNestedArray)).toStrictEqual('(1, 2), (3, 4), (5, 6)')
    expect(literal(testDate)).toStrictEqual("'2012-12-14 13:06:43.152+00'")
    expect(literal(testObject)).toStrictEqual('\'{"a":1,"b":2}\'::jsonb')
  })

  it('should format quotes', () => {
    expect.assertions(1)

    expect(literal("O'Reilly")).toStrictEqual("'O''Reilly'")
  })

  it('should format backslashes', () => {
    expect.assertions(1)

    expect(literal('\\whoop\\')).toStrictEqual("E'\\\\whoop\\\\'")
  })
})
