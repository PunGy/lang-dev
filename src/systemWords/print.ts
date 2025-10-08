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
  output.traceln('--- PRINT ---')
  const token = Machine.peek()
  output.traceln('|->')
  if (token) {
    output.traceln(Token.print(token))
    output.println(Token.printLiteral(token))
  } else {
    output.uniln('EMPTY STACK')
  }
}

// ( n -- )
export function printPop() {
  output.traceln('--- PRINT-POP ---')
  output.trace('|->')
  const token = Machine.pop()
  if (token) {
    output.traceln(Token.print(token))
    output.println(Token.printLiteral(token))
  } else {
    output.uniln('EMPTY STACK')
  }
}

// ( -- )
export function printStack() {
  output.traceln('--- PRINT-STACK ---')
  if (Machine.isEmpty()) {
    output.uniln('EMPTY STACK')
    return
  }

  let i = Machine.length() - 1;
  while (i > -1) {
    const token = Machine.peekPos(i)!
    output.uniln(`[${i}]: ${Token.printLiteral(token)}`)
    i--
  }
  output.traceln('---')
}

