/**
 * Stack manipulation
 */

import * as Machine from '../machine'
import * as Token from '../tokens'
import { output } from '../output'
import { execution } from '../executionGraph'

/**
 * Side effect output
 */

// ( n -- n )
export function print() {
  const token = Machine.peek()
  if (token) {
    output.println(Token.printLiteral(token))
  } else {
    output.uniln('EMPTY STACK')
  }
}

// ( n -- )
export function printPop() {
  execution.beginBlockOperation('PRINT-POP')
  const token = Machine.pop()
  if (token) {
    output.println(Token.printLiteral(token))
  } else {
    output.uniln('EMPTY STACK')
  }
  execution.endBlockOperation()
}

// ( -- )
export function printStack() {
  output.uniln('--- PRINT-STACK ---')
  if (Machine.isEmpty()) {
    output.uniln('EMPTY STACK')
    return
  }

  const len = Machine.length() - 1
  let i = len;
  while (i > -1) {
    const token = Machine.peekPos(i)!
    output.uniln(`[${len - i}]: ${Token.printLiteral(token)}`)
    i--
  }
  output.uniln('---')
}

