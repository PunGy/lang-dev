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
  const skip = () => i++
  const consume = () => code[i++]
  const isAtEnd = () => i === charCount

  const isNum = () => {
    const char = peek()
    if (char === undefined) return false;
    const code = char.charCodeAt(0);
    // 0-9
    return code >= 48 && code <= 57
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
    if (word === 'true') {
      tokens.push(Token.makeBool(true))
    } else if (word === 'false') {
      tokens.push(Token.makeBool(false))
    } else {
      tokens.push(Token.makeWord(word.toUpperCase()))
    }
  }
  const readString = () => {
    skip()
    let value = ''
    while (true) {
      if (isAtEnd()) {
        throw new Error(`Unterminated at the end of the file`)
      }
      if (peek() === '"') {
        skip()
        break
      }
      value += consume()
    }
    tokens.push(Token.makeString(value))
  }
  const readComment = () => {
    skip()
    let lvl = 0
    let comment = ''
    while (!isAtEnd()) {
      if (peek() === ')') {
        if (lvl === 0) {
          skip()
          break
        }
        lvl--
      } else if (peek() === '(') {
        lvl++
      }
      comment += consume()
    }
    tokens.push(Token.makeComment(comment))
  }
  const readNewline = () => {
    skip()
    line++
    tokens.push(Token.makeNewline())
  }

  while (!isAtEnd()) {
    switch (peek()) {
      case '1': case '2': case '3':
      case '4': case '5': case '6':
      case '7': case '8': case '9':
                case '0':
        readNum()
        break
      case whitespace:
        skip()
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
