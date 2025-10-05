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

export const tnum = Symbol('number')
export interface Number extends BaseToken {
  type: typeof tnum;
  num: number;
}
export const makeNumber = (num: number): Number =>
  ({ type: tnum, num })

export const tcomment = Symbol('comment')
export interface Comment extends BaseToken {
  type: typeof tcomment;
  comment: string;
}
export const makeComment = (comment: string): Comment =>
  ({ type: tcomment, comment })

export type Token = Word | Number | Comment

export const print = (token: Token) => {
  switch (token.type) {
    case tword: return `[WORD: "${token.word}"]`
    case tnum: return `[NUMBER: "${token.num}"]`
    case tcomment: return `[COMMENT: "${token.comment}"]`
  }
}

