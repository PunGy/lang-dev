import * as Token from './tokens'

const whitespace = ' '
const newline = '\n'

export function lexer(code: string): Array<Token.Token> {
  const tokens: Array<Token.Token> = []

  let i = 0
  let line = 0

  const charCount = code.length
  const peek = () => code[i]
  const prev = () => code[i - 1]
  const consume = () => code[i++]
  const isAtEnd = () => i === charCount

  const isNum = () => {
    switch (peek()) {
      case '0': case '1': case '2': case '3':
      case '4': case '5': case '6':
      case '7': case '8': case '9':
        return true
      default:
        return false
    }
  }

  const isWord = () => {
    switch (peek()) {
      case whitespace:
      case newline:
        return false
      default:
        return true
    }
  }
  const readNum = () => {
    let strNum = ''
    while (isNum() && !isAtEnd()) {
      strNum += consume()
    }
    const num = parseFloat(strNum)
    tokens.push(Token.makeNumber(num))
  }
  const readWord = () => {
    let word = ''
    while (isWord() && !isAtEnd()) {
      word += consume()
    }
    tokens.push(Token.makeWord(word))
  }
  const readString = () => {
    consume()
    let value = ''
    while (true) {
      if (isAtEnd()) {
        throw new Error(`Unterminated at the end of the file`)
      }
      if (peek() === '"') {
        consume()
        break
      }
      value += consume()
    }
    tokens.push(Token.makeString(value))
  }
  const readComment = () => {
    consume()
    let comment = ''
    while (!isAtEnd()) {
      if (peek() === ')') {
        consume()
        break
      }
      comment += consume()
    }
    tokens.push(Token.makeComment(comment))
  }
  const readNewline = () => {
    consume()
    line++
    tokens.push(Token.makeNewline())
  }

  while (!isAtEnd()) {
    switch (peek()) {
      case '0': case '1': case '2': case '3':
      case '4': case '5': case '6':
      case '7': case '8': case '9':
        readNum()
        break
      case whitespace:
        consume()
        break
      case newline:
        readNewline()
        break
      case '(':
        readComment()
        break
      case '"':
        readString()
        break
      default:
        readWord()
        break
    }
  }

  return tokens
}
