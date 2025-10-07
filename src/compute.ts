import * as Token from './tokens'
import * as Machine from './machine'
import { wordMap } from './systemWords/wordMap'
import { metaWordMap } from './metaWords/wordMap'

type Token = Token.Token

export class Computer {
  private tokens: Array<Token>

  constructor(
    tokens: Array<Token>
  ) {
    this.tokens = []
    for (let i = tokens.length - 1; i > -1; i--) {
      this.tokens.push(tokens[i]!)
    }
  }

  peek() {
    return this.tokens[0]
  }
  consume() {
    return this.tokens.pop()
  }
  skip() {
    this.tokens.pop()
  }
  isAtEnd() {
    return this.tokens.length === 0
  }
  pushTokens(tokens: Array<Token>) {
    for (let i = tokens.length - 1; i > -1; i--) {
      const tok = tokens[i]!
      this.tokens.push(tok)
    }
  }
  pushLiteral(literal: Token.Literal) {
    Machine.push(literal)
  }
  processWord(wordToken: Token.Word) {
    const processFn = wordMap.get(wordToken.word)
    if (processFn) {
      processFn()
      return;
    }

    const metaFn = metaWordMap.get(wordToken.word)
    if (metaFn) {
      metaFn(this)
      return
    }

    throw new Error(`Unknown word: ${wordToken.word}`)
  }

  compute() {
    while (!this.isAtEnd()) {
      const token = this.consume()!
      switch (token.type) {
        case Token.tnum:
        case Token.tbool:
        case Token.tstr:
          this.pushLiteral(token)
          break
        case Token.tword:
          this.processWord(token)
          break
      }
    }
  }
}
