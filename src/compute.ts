import * as Token from './tokens'
import * as Machine from './machine'

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
    Machine.push(literal)
  }
  const processWord = (wordToken: Token.Word) => {
    const processFn = Machine.wordMap.get(wordToken.word)
    if (processFn) {
      processFn()
      return;
    }

    const innerFn = userWordMap.get(wordToken.word)
    if (innerFn) {
      Machine.push(compute(innerFn))
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

  const result = Machine.peek()
  if (result === undefined) {
    throw new Error('stack is empty!!!')
  }

  return result
}

compute.prepare = () => {
  Machine.clear()
}
