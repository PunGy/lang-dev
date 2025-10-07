/**
  * Numeric Mathematics
  */
import * as Token from '../tokens'
import { makePureFn } from './utils'

// (n1 n2 -- sum)
export const plus = makePureFn(
  '+',
  [Token.tnum, Token.tnum],
  Token.tnum,
  ([b, a]) => a + b,
  ([b, a]) => `${a} + ${b}`,
  'plus',
)

// (n1 n2 -- difference)
export const minus = makePureFn(
  '-',
  [Token.tnum, Token.tnum],
  Token.tnum,
  ([b, a]) => a - b,
  ([b, a]) => `${a} - ${b}`,
  'minus',
)

// (n1 n2 -- prod)
export const mul = makePureFn(
  '*',
  [Token.tnum, Token.tnum],
  Token.tnum,
  ([b, a]) => a * b,
  ([b, a]) => `${a} * ${b}`,
  'multiply',
)

// (n1 n2 -- divide)
export const div = makePureFn(
  '/',
  [Token.tnum, Token.tnum],
  Token.tnum,
  ([b, a]) => a / b,
  ([b, a]) => `${a} / ${b}`,
  'divide',
)

// (n1 n2 -- is-equal)
export const eq = makePureFn(
  '=',
  [Token.tnum, Token.tnum],
  Token.tbool,
  ([b, a]) => a === b,
  ([b, a]) => `${a} = ${b}`,
  'equals',
)

// (n1 n2 -- is-greater)
export const gt = makePureFn(
  '>',
  [Token.tnum, Token.tnum],
  Token.tbool,
  ([b, a]) => a > b,
  ([b, a]) => `${a} > ${b}`,
  'greater',
)

// (n1 n2 -- is-less)
export const lt = makePureFn(
  '<',
  [Token.tnum, Token.tnum],
  Token.tbool,
  ([b, a]) => a < b,
  ([b, a]) => `${b} < ${a}`,
  'less',
)
