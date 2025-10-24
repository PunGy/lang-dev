import * as Token from './tokens'

const whitespace = ' '
const newline = '\n'
const lambda = '\\'
const dot = '.'
const openParen = '('
const closeParen = ')'

export function lexer(code: string): Array<Token.Token> {
  const tokens: Array<Token.Token> = []

  let i = 0
  let line = 0

  const charCount = code.length
  const peek = () => code[i]
  const peekNext = () => code[i + 1]
  const prev = () => code[i - 1]
  const skip = () => i++
  const consume = () => code[i++]
  const isAtEnd = () => i === charCount

  const isWord = () => {
    switch (peek()) {
      case whitespace:
      case newline:
      case dot:
      case lambda:
      case openParen:
      case closeParen:
        return false
      default:
        return true
    }
  }
  const readWord = () => {
    let word = ''

    while (isWord() && !isAtEnd()) {
      word += consume()
    }
    tokens.push(Token.makeWord(word))
  }

  const readUnscopedComment = () => {
    skip()

    let comment = ''
    while (!isAtEnd() && peek() !== newline) {
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
      case whitespace:
        skip()
        break
      case newline:
        readNewline()
        break
      case '-':
        if (peekNext() === '-') {
          readUnscopedComment()
          break
        }
      case lambda:
        tokens.push(Token.makeLambda())
        consume()
        break
      case dot:
        tokens.push(Token.makeDot())
        consume()
        break
      case openParen:
        tokens.push(Token.makeOpenParen())
        consume()
        break
      case closeParen:
        tokens.push(Token.makeCloseParen())
        consume()
        break
      default:
        readWord()
        break
    }
  }

  return tokens
}
