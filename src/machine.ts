import * as Token from './tokens'
import { output } from './output'

type Token = Token.Token

export function compute(tokens: Array<Token>): Token {
  let i = 0
  const count = tokens.length

  const peek = () => tokens[i]
  const consume = () => tokens[i++]
  const skip = () => i++
  const isAtEnd = () => i === count

  const userWordMap = new Map<string, Array<Token>>()

  const pushLiteral = (literal: Token.Literal) => {
    stackPush(literal)
  }
  const processWord = (wordToken: Token.Word) => {
    const processFn = systemWordMap.get(wordToken.word)
    if (processFn) {
      processFn()
      return;
    }

    const innerFn = userWordMap.get(wordToken.word)
    if (innerFn) {
      stackPush(compute(innerFn))
      return;
    }

    throw new Error(`Unknown word: ${wordToken.word}`)
  }

  while (!isAtEnd()) {
    const token = consume()!
    switch (token.type) {
      case Token.tnum:
      case Token.tbool:
      case Token.tstr:
        pushLiteral(token)
        break
      case Token.tword:
        processWord(token)
        break
    }
  }

  const result = stackPeek()
  if (result === undefined) {
    throw new Error('stack is empty!!!')
  }

  return result
}

compute.prepare = () => {
  stackClear()
}

const _stack: Array<Token> = []
const systemWordMap = new Map<string, () => void>()

const stackClear = () => {
  _stack.length = 0
}
const stackPeek = () => _stack.at(-1)
const stackPush = (token: Token) => {
  _stack.push(token)
  output.println(`PUSH: ${Token.print(token)}, LENGTH: ${_stack.length}`)
}
const stackPop = (): Token | undefined => {
  const token = _stack.pop()
  if (token) {
    output.println(`POP: ${Token.print(token)}, LENGTH: ${_stack.length}`)
  } else {
    output.println('Attempt to pop from emtpy stack')
  }
  return token
}

systemWordMap.set('+', plus)
systemWordMap.set('*', mul)

function wrongParamMessage(word: string, paramMessage: string, got: string) {
  return `${word}: require ${paramMessage} on top of stack! Got: ${got}`
}

// (n1 n2 -- sum)
function plus() {
  const n1 = stackPop()
  const wrongUse = wrongParamMessage.bind(null, '+', 'two numbers')

  if (n1 === undefined) {
    throw new Error(wrongUse('nothing!'))
  } else if (n1.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n1)))
  }
  const n2 = stackPop()
  if (n2 === undefined) {
    throw new Error(wrongUse('only one!'))
  } else if (n2.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n2)))
  }

  output.println(`-- ${n1.num} "+" ${n2.num} --`)

  stackPush(Token.makeNumber(n1.num + n2.num))
}
// (n1 n2 -- sum)
function mul() {
  const n1 = stackPop()
  const wrongUse = wrongParamMessage.bind(null, '*', 'two numbers')

  if (n1 === undefined) {
    throw new Error(wrongUse('nothing!'))
  } else if (n1.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n1)))
  }
  const n2 = stackPop()
  if (n2 === undefined) {
    throw new Error(wrongUse('only one!'))
  } else if (n2.type !== Token.tnum) {
    throw new Error(wrongUse(Token.print(n2)))
  }

  output.println(`-- ${n1.num} "*" ${n2.num} --`)

  stackPush(Token.makeNumber(n1.num * n2.num))
}
