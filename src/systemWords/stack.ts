/**
 * Stack manipulation
 */

import * as Machine from '../machine'
import * as Token from '../tokens'
import { output } from '../output'
import { makePureFn, printTypes, wrongParamMessage } from './utils'
import { execution } from '../executionGraph'

// (n -- )
export function drop() {
  execution.beginBlockOperation('DROP')
  Machine.pop()
  execution.endBlockOperation()
}

// (n -- n n)
export function dup() {
  execution.beginBlockOperation('DUP')
  const token = Machine.peek()
  if (token === undefined) {
    throw new Error('DUP: cannot duplicate empty stack!')
  }
  execution.operation('PEEK', { token })
  Machine.push(token)
  execution.endBlockOperation()
}

// (n1 n2 -- n2 n1)
export function swap() {
  execution.beginBlockOperation('SWAP')

  const n2 = Machine.pop()
  if (n2 === undefined) {
    throw new Error('SWAP: need at least two elements on top of stack')
  }
  const n1 = Machine.pop()
  if (n1 === undefined) {
    throw new Error('SWAP: empty stack!')
  }

  Machine.push(n2)
  Machine.push(n1)
  execution.endBlockOperation()
}

// ( n1 n2 -- n1 n2 n1 )
export function over() {
  execution.beginBlockOperation('OVER')

  const n2 = Machine.pop()
  if (n2 === undefined) {
    throw new Error('OVER: need at least two elements on top of stack')
  }
  const n1 = Machine.pop()
  if (n1 === undefined) {
    throw new Error('OVER: empty stack!')
  }

  Machine.push(n1)
  Machine.push(n2)
  Machine.push(n1)
  execution.endBlockOperation()
}

export function isEmpty() {
  execution.beginBlockOperation('IS_EMPTY')
  Machine.push(Token.makeBool(Machine.isEmpty()))
  execution.endBlockOperation()
}

export function len() {
  execution.beginBlockOperation('STACK_LEN')
  Machine.push(Token.makeNumber(Machine.length()))
  execution.endBlockOperation()
}

const wrongPickUse = wrongParamMessage.bind(null, 'PICK', printTypes([Token.tnum]))
export function pick() {
  execution.beginBlockOperation('PICK')

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
  execution.endBlockOperation()
}
