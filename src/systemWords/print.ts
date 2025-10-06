/**
 * Stack manipulation
 */

import * as Machine from '../machine'
import * as Token from '../tokens'
import { output } from '../output'

/**
 * Side effect output
 */

// ( n -- n )
export function print() {
  output.println('--- PRINT ---')
  const token = Machine.peek()
  output.print('|->')
  if (token) {
    output.println(Token.print(token))
  } else {
    output.println('EMPTY STACK')
  }
}

// ( n -- )
export function printPop() {
  output.println('--- PRINT-POP ---')
  output.print('|->')
  const token = Machine.pop()
  if (token) {
    output.println(Token.print(token))
  } else {
    output.println('EMPTY STACK')
  }
}

// ( -- )
export function printStack() {
  output.println('--- PRINT-STACK ---')
  if (Machine.isEmpty()) {
    output.print('|-> EMPTY STACK')
    return
  }

  let i = Machine.length() - 1;
  while (i > -1) {
    const token = Machine.peekPos(i)!
    output.println(`[${i}]: ${Token.print(token)}`)
    i--
  }
  output.println('---')
}

