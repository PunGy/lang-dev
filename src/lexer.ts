import * as Token from './tokens'

const whitespace = ' '

export function lexer(code: string): Array<Token.Token> {
  const tokens: Array<Token.Token> = []

  let i = 0

  const charCount = code.length
  const peek = () => code[i]
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
    while (peek() !== whitespace && !isAtEnd()) {
      word += consume()
    }
    tokens.push(Token.makeWord(word))
  }
  const readComment = () => {
    consume()
    while (peek() !== ')' && !isAtEnd()) {
      consume()
    }
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
      case '(':
        readComment()
        break
      default:
        readWord()
        break
    }
  }

  return tokens
}
