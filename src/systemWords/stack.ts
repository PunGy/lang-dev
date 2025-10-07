/**
 * Stack manipulation
 */

import * as Machine from '../machine'
import * as Token from '../tokens'
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

// (n1 n2 -- n2 n1)
export function swap() {
  output.println('--- SWAP ---')

  const n2 = Machine.pop()
  if (n2 === undefined) {
    throw new Error('SWAP: need at least two elements on top of stack')
  }
  const n1 = Machine.pop()
  if (n1 === undefined) {
    throw new Error('SWAP: empty stack!')
  }

  const [t1, t2] = [Token.print(n1), Token.print(n2)]
  output.println(`-( swap: (${t1} ${t2}), (${t2} ${t1}) )-`)

  Machine.push(n2)
  Machine.push(n1)
}

// ( n1 n2 -- n1 n2 n1 )
export function over() {
  output.println('--- OVER ---')

  const n2 = Machine.pop()
  if (n2 === undefined) {
    throw new Error('OVER: need at least two elements on top of stack')
  }
  const n1 = Machine.pop()
  if (n1 === undefined) {
    throw new Error('OVER: empty stack!')
  }

  output.println(`-( over: push ${Token.print(n1)} on top )-`)

  Machine.push(n1)
  Machine.push(n2)
  Machine.push(n1)
}
