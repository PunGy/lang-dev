import * as Token from './tokens'
import { output } from './output'

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
  output.println(`PUSH: ${Token.print(token)}, LENGTH: ${stack.length}`)
}
export const pop = (): Token | undefined => {
  const token = stack.pop()
  if (token) {
    output.println(`POP: ${Token.print(token)}, LENGTH: ${stack.length}`)
  } else {
    output.println('Attempt to pop from emtpy stack')
  }
  return token
}

export const length = () => stack.length
export const isEmpty = () => stack.length === 0

