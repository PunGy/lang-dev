import * as Token from "./tokens";

type Token = Token.Token

export function parse(tokens: Array<Token>): Token.Expression {
  /*
expr ::= abstraction | application
abstraction ::= '\' VAR '.' atom
application ::= atom { atom }
atom ::= VAR | '(' expr ')'

\x.y

((\x.(\y.(y))) a)
   */

  let i = 0
  const tokensCount = tokens.length
  const peek = () => tokens[i]
  const consume = () => tokens[i++]
  const skip = () => i++
  const prev = () => tokens[i-1]
  const check = (token: symbol) => {
    if (isAtEnd())
      return false

    return peek()!.type === token
  }
  const tokenMatch = (token: symbol): boolean => {
    if (check(token)) {
      skip()
      return true
    }
    return false
  }
  const isAtEnd = () => i === tokensCount

  const error = (msg: string) => {
    return new Error(msg)
  }

  function expression(): Token.Expression {
    if (tokenMatch(Token.tlambda)) {
      return abstraction()
    }

    return application()
  }
  function abstraction() {
    if (!check(Token.tword)) {
      throw error('Abstraction must start with argument!')
    }

    const argT = consume() as Token.Word
    const arg = Token.makeVariable(argT)
    if (!tokenMatch(Token.tdot)) {
      throw error('Argument and body should be separated by . symbol!')
    }

    const body = expression()
    return Token.makeAbstraction(
      arg,
      body,
    )
  }
  function application() {
    let expr: Token.Expression = atom()

    while (true) {
      if (check(Token.tword) || check(Token.topenParen) || check(Token.tlambda)) {
        const right = atom()
        expr = Token.makeApplication(expr, right)
      } else {
        break
      }
    }

    return expr
  }
  function atom() {
    // Case 1: A variable
    if (tokenMatch(Token.tword)) {
      return Token.makeVariable(prev() as Token.Word);
    }

    // Case 2: A parenthesized expression
    if (tokenMatch(Token.topenParen)) {
      const expr = expression()
      if (!tokenMatch(Token.tcloseParen)) {
        throw error('Expected a closing parenthesis ")".')
      }
      return expr
    }

    if (tokenMatch(Token.tlambda)) {
      return abstraction()
    }
    throw error(`Unexpected token: ${peek()?.type.toString()}. Expected an expression.`);
  }
  const result = expression()
  if (!isAtEnd()) {
    throw error(`Unexpected token found after expression: ${peek()?.type.toString()}`);
  }
  return result
}
