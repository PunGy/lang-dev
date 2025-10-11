/**
  * String operations
  */
import * as Token from '../tokens'
import { makePureFn } from './utils'

// (s1 s2 -- concatenation)
export const plus = makePureFn(
  '\'+',
  [Token.tstr, Token.tstr],
  Token.tstr,
  ([b, a]) => a + b,
  ([b, a]) => `${a} + ${b}`,
  'concatenate',
)

// (s1 n2 -- s1 duplicated n2 times)
export const mul = makePureFn(
  '\'*',
  [Token.tnum,  Token.tstr],
  Token.tstr,
  ([times, str]) => str.repeat(times),
  ([times, str]) => `"${str}" * ${times}`,
  'duplicate',
)

// (n1 n2 -- is-equal)
export const eq = makePureFn(
  '\'=',
  [Token.tstr, Token.tstr],
  Token.tbool,
  ([b, a]) => a === b,
  ([b, a]) => `"${a}" = "${b}"`,
  'equals',
)

export const len = makePureFn(
  '\'len',
  [Token.tstr],
  Token.tnum,
  ([str]) => str.length,
  ([str]) => `len "${str}"`,
  'string-length',
)

export const index = makePureFn(
  '\'i',
  [Token.tnum, Token.tstr],
  Token.tstr,
  ([i, str]) => {
    if (i < 0) {
      throw new Error(`Index for string must be positive`)
    }
    if (i > str.length - 1) {
      throw new Error(`String length is ${str.length}, index must be less than that!`)
    }

    return str[i]!
  },
  ([i, str]) => `"${str}"[${i}]`,
  'string-index',
)

