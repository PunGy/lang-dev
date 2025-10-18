interface BaseToken {
  type: symbol;
}

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

export const print = (token: Token): string => {
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
