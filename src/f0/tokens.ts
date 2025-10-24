interface BaseToken {
  type: symbol;
}

/**
 * Lexical tokens
 */

export const tword = Symbol('word')
export interface Word extends BaseToken {
  type: typeof tword;
  word: string;
}
export const makeWord = (word: string): Word =>
  ({ type: tword, word })

export const tnewline = Symbol('newline')
export interface Newline extends BaseToken {
  type: typeof tnewline;
}
export const makeNewline = (): Newline =>
  ({ type: tnewline })

export const tdot = Symbol('dot')
export interface Dot extends BaseToken {
  type: typeof tdot;
}
export const makeDot = (): Dot =>
  ({ type: tdot })

export const tlambda = Symbol('lambda')
export interface Lambda extends BaseToken {
  type: typeof tlambda;
}
export const makeLambda = (): Lambda =>
  ({ type: tlambda })

export const topenParen = Symbol('op')
export interface OpenParen extends BaseToken {
  type: typeof topenParen;
}
export const makeOpenParen = (): OpenParen =>
  ({ type: topenParen })

export const tcloseParen = Symbol('cp')
export interface CloseParen extends BaseToken {
  type: typeof tcloseParen;
}
export const makeCloseParen = (): CloseParen =>
  ({ type: tcloseParen })

export const tcomment = Symbol('comment')
export interface Comment extends BaseToken {
  type: typeof tcomment;
  comment: string;
}
export const makeComment = (comment: string): Comment =>
  ({ type: tcomment, comment })

export type Token = Word | Dot | Lambda | OpenParen | CloseParen | Comment | Newline

const tokensSet = new Set([tword, tdot, topenParen, tcloseParen, tcomment, tnewline])

export function isToken(obj: any): obj is Token {
  return obj instanceof Object && typeof obj.type === 'symbol' && tokensSet.has(obj.type)
}

/**
 * AST tokens
 */


export const tvar = Symbol('var')
export interface Variable extends BaseToken {
  type: typeof tvar;
  name: Word;
}
export const makeVariable = (name: Word): Variable =>
  ({ type: tvar, name })

export const tabstraction = Symbol('abstraction')
export interface Abstraction extends BaseToken {
  type: typeof tabstraction;
  arg: Variable;
  expr: Expression;
}
export const makeAbstraction = (arg: Variable, expr: Expression): Abstraction =>
  ({ type: tabstraction, arg, expr })

export const tapply = Symbol('application')
export interface Application extends BaseToken {
  type: typeof tapply;
  func: Expression;
  arg: Expression;
}
export const makeApplication = (func: Expression, arg: Expression): Application =>
  ({ type: tapply, func, arg })

export type Expression = Variable | Abstraction | Application

export const tokenInfo = (token: Token): string => {
  switch (token.type) {
    case tword: return `[VAR: "${token.word}"]`
    case tnewline: return `[NEWLINE]`
    case tdot: return `[DOT]`
    case tlambda: return `[LAMBDA]`
    case topenParen: return `[OPEN_PAREN]: (`
    case tcloseParen: return `[CLOSE_PAREN]: )`
    case tcomment: return `[COMMENT: "${token.comment}"]`
  }
}

export const printToken = (token: Token): string => {
  switch (token.type) {
    case tword: return token.word
    case tnewline: return ''
    case tdot: return '.'
    case tlambda: return 'λ'
    case topenParen: return '('
    case tcloseParen: return ')'
    case tcomment: return ''
  }
}

enum PrintContext {
  TopLevel,      // The root of the expression, or inside an abstraction body
  App_Function,  // The expression is the 'func' part of an application
  App_Argument,  // The expression is the 'arg' part of an application
}
export const printExpression = (
  expr: Expression,
  context: PrintContext = PrintContext.TopLevel
): string => {
  switch (expr.type) {
    case tvar:
      return expr.name.word

    case tabstraction: {
      const body = printExpression(expr.expr, PrintContext.TopLevel)

      if (context === PrintContext.App_Function || context === PrintContext.App_Argument) {
        return `(λ${expr.arg.name.word}.${body})`
      } else {
        return `λ${expr.arg.name.word}.${body}`
      }
    }

    case tapply: {
      const func = printExpression(expr.func, PrintContext.App_Function)
      const arg = printExpression(expr.arg, PrintContext.App_Argument)

      if (context === PrintContext.App_Argument) {
        return `(${func} ${arg})`
      } else {
        return `${func} ${arg}`
      }
    }
  }
}

