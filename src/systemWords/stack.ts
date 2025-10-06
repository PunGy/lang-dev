/**
 * Stack manipulation
 */

import * as Machine from '../machine'
import { output } from '../output'

// (n -- )
export function drop() {
  output.println('--- DROP ---')
  output.print('|->')
  Machine.pop()
}

// (n -- n n)
export function dup() {
  const token = Machine.peek()
  if (token === undefined) {
    throw new Error('DUP: cannot duplicate empty stack!')
  }
  output.println('--- DUP ---')
  output.print('|->')
  Machine.push(token)
}
