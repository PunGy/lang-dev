import * as Token from './tokens'
import { output } from './output'

type Token = Token.Token

const _stack: Array<Token> = []
export const wordMap = new Map<string, () => void>()

export const clear = () => {
  _stack.length = 0
}
export const peek = () => _stack.at(-1)
export const push = (token: Token) => {
  _stack.push(token)
  output.println(`PUSH: ${Token.print(token)}, LENGTH: ${_stack.length}`)
}
export const pop = (): Token | undefined => {
  const token = _stack.pop()
  if (token) {
    output.println(`POP: ${Token.print(token)}, LENGTH: ${_stack.length}`)
  } else {
    output.println('Attempt to pop from emtpy stack')
  }
  return token
}

wordMap.set('+', plus)
wordMap.set('-', minus)
wordMap.set('*', mul)
wordMap.set('/', div)

function wrongParamMessage(word: string, paramMessage: string, got: string) {
  return `${word}: require ${paramMessage} on top of stack! Got: ${got}`
}

// (n1 n2 -- sum)
function plus() {
  const n1 = pop()
  const wrongUse = wrongParamMessage.bind(null, '+', 'two numbers')

  if (n1 === undefined) {
    throw new Error(wrongUse('nothing!'))
  } else if (n1.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n1)))
  }
  const n2 = pop()
  if (n2 === undefined) {
    throw new Error(wrongUse('only one!'))
  } else if (n2.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n2)))
  }

  output.println(`-- ${n1.num} + ${n2.num} --`)
  output.print('|-> ')

  push(Token.makeNumber(n1.num + n2.num))
}

// (n1 n2 -- difference)
function minus() {
  const n1 = pop()
  const wrongUse = wrongParamMessage.bind(null, '-', 'two numbers')

  if (n1 === undefined) {
    throw new Error(wrongUse('nothing!'))
  } else if (n1.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n1)))
  }
  const n2 = pop()
  if (n2 === undefined) {
    throw new Error(wrongUse('only one!'))
  } else if (n2.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n2)))
  }

  output.println(`-- ${n1.num} - ${n2.num} --`)
  output.print('|-> ')

  push(Token.makeNumber(n1.num - n2.num))
}

// (n1 n2 -- sum)
function mul() {
  const n1 = pop()
  const wrongUse = wrongParamMessage.bind(null, '*', 'two numbers')

  if (n1 === undefined) {
    throw new Error(wrongUse('nothing!'))
  } else if (n1.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n1)))
  }
  const n2 = pop()
  if (n2 === undefined) {
    throw new Error(wrongUse('only one!'))
  } else if (n2.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n2)))
  }

  output.println(`-- ${n1.num} * ${n2.num} --`)
  output.print('|-> ')

  push(Token.makeNumber(n1.num * n2.num))
}

function div() {
  const n1 = pop()
  const wrongUse = wrongParamMessage.bind(null, '/', 'two numbers')

  if (n1 === undefined) {
    throw new Error(wrongUse('nothing!'))
  } else if (n1.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n1)))
  }
  const n2 = pop()
  if (n2 === undefined) {
    throw new Error(wrongUse('only one!'))
  } else if (n2.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n2)))
  }

  output.println(`-- ${n1.num} / ${n2.num} --`)
  output.print('|-> ')

  push(Token.makeNumber(n1.num / n2.num))
}

