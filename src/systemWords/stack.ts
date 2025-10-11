/**
 * Stack manipulation
 */

import * as Machine from '../machine'
import * as Token from '../tokens'
import { output } from '../output'
import { makePureFn, printTypes, wrongParamMessage } from './utils'

// (n -- )
export function drop() {
  output.traceln('--- DROP ---')
  output.trace('|->')
  Machine.pop()
}

// (n -- n n)
export function dup() {
  const token = Machine.peek()
  if (token === undefined) {
    throw new Error('DUP: cannot duplicate empty stack!')
  }
  output.traceln('--- DUP ---')
  output.trace('|->')
  Machine.push(token)
}

// (n1 n2 -- n2 n1)
export function swap() {
  output.traceln('--- SWAP ---')

  const n2 = Machine.pop()
  if (n2 === undefined) {
    throw new Error('SWAP: need at least two elements on top of stack')
  }
  const n1 = Machine.pop()
  if (n1 === undefined) {
    throw new Error('SWAP: empty stack!')
  }

  const [t1, t2] = [Token.print(n1), Token.print(n2)]
  output.traceln(`-( swap: (${t1} ${t2}), (${t2} ${t1}) )-`)

  Machine.push(n2)
  Machine.push(n1)
}

// ( n1 n2 -- n1 n2 n1 )
export function over() {
  output.traceln('--- OVER ---')

  const n2 = Machine.pop()
  if (n2 === undefined) {
    throw new Error('OVER: need at least two elements on top of stack')
  }
  const n1 = Machine.pop()
  if (n1 === undefined) {
    throw new Error('OVER: empty stack!')
  }

  output.traceln(`-( over: push ${Token.print(n1)} on top )-`)

  Machine.push(n1)
  Machine.push(n2)
  Machine.push(n1)
}

export function isEmpty() {
  output.traceln('--- IS_EMPTY? ---')

  output.trace('|->')
  Machine.push(Token.makeBool(Machine.isEmpty()))
}

export function len() {
  output.traceln('--- STACK_LEN ---')

  output.trace('|->')
  Machine.push(Token.makeNumber(Machine.length()))
}

const wrongPickUse = wrongParamMessage.bind(null, 'PICK', printTypes([Token.tnum]))
export function pick() {
  output.traceln('--- PICK ---')

  const n = Machine.pop()

  if (n === undefined) {
    throw new Error(wrongPickUse('nothing!'))
  }
  if (n.type !== Token.tnum) {
    throw new Error(wrongPickUse(printTypes([n.type])))
  }

  const t = Machine.pick(n.value)

  if (t === undefined) {
    throw new Error(`Cannot pick item on ${n.value} position of the stack!`)
  }

  Machine.push(t)
}
