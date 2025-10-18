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

export const tnum = Symbol('number')
export interface Number extends BaseToken {
  type: typeof tnum;
  value: number;
}
export const makeNumber = (value: number): Number =>
  ({ type: tnum, value })

export const tstr = Symbol('string')
export interface String extends BaseToken {
  type: typeof tstr;
  value: string;
}
export const makeString = (value: string): String =>
  ({ type: tstr, value })

export const tbool = Symbol('boolean')
export interface Bool extends BaseToken {
  type: typeof tbool;
  value: boolean;
}
export const makeBool = (value: boolean): Bool =>
  ({ type: tbool, value })

export const tcomment = Symbol('comment')
export interface Comment extends BaseToken {
  type: typeof tcomment;
  comment: string;
}
export const makeComment = (comment: string): Comment =>
  ({ type: tcomment, comment })

// some internal interpretator side effect, not part of the language
export const teffect = Symbol('effect')
export interface Effect extends BaseToken {
  type: typeof teffect;
  effect: () => void;
}
export const makeEffect = (effect: () => void): Effect =>
  ({ type: teffect, effect })

export type Literal = Number | String | Bool
export type LiteralType = Literal['type']
export type LiteralType2Value = {
  [T in Literal as T['type']]: T['value']
}
export type LiteralType2Token = {
  [T in Literal as T['type']]: T
}

export const printType = (t: LiteralType) => {
  switch (t) {
    case tnum: return 'num'
    case tstr: return 'str'
    case tbool: return 'bool'
  }
}

export type Token = Word | Number | String | Bool | Comment | Newline | Effect

const tokensSet = new Set([tword, tnum, tstr, tbool, tcomment, tnewline, teffect])
const literalSet = new Set([tnum, tstr, tbool])

export function isToken(obj: any): obj is Token {
  return obj instanceof Object && typeof obj.type === 'symbol' && tokensSet.has(obj.type)
}
export function isLiteralToken(obj: any): obj is Literal {
  return obj instanceof Object && typeof obj.type === 'symbol' && literalSet.has(obj.type)
}
export function isLiteral(token: Token): token is Literal {
  return literalSet.has(token.type)
}

export const print = (token: Token): string => {
  switch (token.type) {
    case tword: return `[WORD: "${token.word}"]`
    case tnewline: return `[NEWLINE]`
    case tbool: return `[BOOL: ${token.value}]`
    case tnum: return `[NUMBER: ${token.value}]`
    case tstr: return `[STRING: "${token.value}"]`
    case tcomment: return `[COMMENT: "${token.comment}"]`
    case teffect: return `[EFFECT]`
  }
}
export const printLiteral = (token: Literal): string => {
  switch (token.type) {
    case tstr: return '"' + token.value + '"'
    default: return token.value.toString()
  }
}

