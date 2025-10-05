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
  num: number;
}
export const makeNumber = (num: number): Number =>
  ({ type: tnum, num })

export const tstr = Symbol('string')
export interface String extends BaseToken {
  type: typeof tstr;
  value: string;
}
export const makeString = (value: string): String =>
  ({ type: tstr, value })

export const tcomment = Symbol('comment')
export interface Comment extends BaseToken {
  type: typeof tcomment;
  comment: string;
}
export const makeComment = (comment: string): Comment =>
  ({ type: tcomment, comment })

export type Token = Word | Number | String | Comment | Newline

export const print = (token: Token) => {
  switch (token.type) {
    case tword: return `[WORD: "${token.word}"]`
    case tnewline: return `[NEWLINE]`
    case tnum: return `[NUMBER: "${token.num}"]`
    case tstr: return `[STRING: "${token.value}"]`
    case tcomment: return `[COMMENT: "${token.comment}"]`
  }
}

