import * as Token from './tokens'
import { output } from './output'
import { initMetaWords } from './metaWords/words'
import { initSystemWords } from './systemWords/words'
import { execution } from './executionGraph'

type Token = Token.Literal

/****************************
  * System stack            *
  * Only for literal tokens *
  ***************************/
const stack: Array<Token> = []

export const clear = () => {
  stack.length = 0
}
export const peek = () => stack.at(-1)
export const peekPos = (i: number) => stack[i]
export const push = (token: Token) => {
  stack.push(token)
  execution.operation('PUSH', { token })
}
export const pop = (): Token | undefined => {
  const token = stack.pop()
  execution.operation('POP', { token })
  if (!token) {
    output.print('Attempt to pop from emtpy stack')
  }
  return token
}

export const length = () => stack.length
export const isEmpty = () => stack.length === 0

export const pick = (i: number) =>
  stack[stack.length - 1 - i]

export function init() {
  initMetaWords()
  initSystemWords()
}

