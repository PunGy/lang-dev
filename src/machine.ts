import * as Token from './tokens'
import { output } from './output'

type Token = Token.Token

const stack: Array<Token> = []
export const wordMap = new Map<string, () => void>()

export const clear = () => {
  stack.length = 0
}
export const peek = () => stack.at(-1)
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

/**
  * Registration of system functions
  */

wordMap.set('+', plus)
wordMap.set('-', minus)
wordMap.set('*', mul)
wordMap.set('/', div)

wordMap.set('DUP', dup)
wordMap.set('DROP', drop)

wordMap.set('.', print)
wordMap.set('.S', printStack)
wordMap.set('PRINT', print)
wordMap.set('PRINT-STACK', printStack)

function wrongParamMessage(word: string, paramMessage: string, got: string) {
  return `${word}: require ${paramMessage} on top of stack! Got: ${got}`
}

/**********************
  * System functions: *
  *********************
  */

/**
 * Stack manipulation
 */

// (n -- )
function drop() {
  output.println('--- DROP ---')
  output.print('|->')
  pop()
}

// (n -- n n)
function dup() {
  const token = peek()
  if (token === undefined) {
    throw new Error('DUP: cannot duplicate empty stack!')
  }
  output.println('--- DUP ---')
  output.print('|->')
  push(token)
}

/**
 * Side effect output
 */

// ( -- )
function print() {
  output.println('--- PRINT ---')
  const token = peek()
  output.print('|->')
  if (token) {
    output.println(Token.print(token))
  } else {
    output.println('EMPTY STACK')
  }
}

// ( -- )
function printStack() {
  output.println('--- PRINT-STACK ---')
  if (stack.length === 0) {
    output.print('|-> EMPTY STACK')
    return
  }

  let i = stack.length - 1;
  while (i > -1) {
    const token = stack[i]!
    output.println(`[${i}]: ${Token.print(token)}`)
    i--
  }
  output.println('---')
}

/**
  * Mathematics
  */

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

// (n1 n2 -- prod)
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

// (n1 n2 -- divide)
function div() {
  const wrongUse = wrongParamMessage.bind(null, '/', 'two numbers')

  const n1 = pop()
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

