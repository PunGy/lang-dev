/**
  * Boolean Mathematics
  */
import * as Token from '../tokens'
import { makePureFn } from './utils'

// (flag -- not flag)
export const not = makePureFn(
  'not',
  [Token.tbool],
  Token.tbool,
  ([a]) => !a,
  ([a]) => `not ${a}`,
)
