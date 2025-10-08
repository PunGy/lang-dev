import type { Computer } from '../compute'
import { output } from '../output'
import * as Token from '../tokens'
import { metaWordMap } from './wordMap'

type Token = Token.Token

export function newWord(computer: Computer) {
  let lvl = 0
  let terminated = false
  const tokens: Array<Token> = []

  const word = computer.consume()
  if (word === undefined) {
    throw new Error('Unterminated word registration!')
  }
  if (word.type !== Token.tword) {
    throw new Error(`Cannot declare word name with ${Token.print(word)}`)
  }

  tokenLoop: while (!computer.isAtEnd()) {
    const tok = computer.consume()!

    if (tok.type === Token.tword) {
      switch (tok.word) {
        case ':':
          lvl++;
          break
        case ';':
          if (lvl === 0) {
            terminated = true
            break tokenLoop
          } else {
            lvl--
          }
          break
      }
    }
    tokens.push(tok)
  }
  if (lvl > 0 || !terminated) {
    throw new Error(`Unterminated word registration!`)
  }

  metaWordMap.set(word.word, () => {
    output.traceln(`-( UNWRAP ${word.word} )-`)
    computer.pushTokens(tokens)
  })
}
