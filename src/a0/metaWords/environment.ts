import type { Computer } from '../compute'
import { execution } from '../execution'
import * as Token from '../tokens'
import { makeEndBlockEffect } from './utils'
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
  tokens.push(
    makeEndBlockEffect()
  )

  const fnName = word.word
  metaWordMap.set(fnName, () => {
    execution.beginBlockOperation(fnName)
    computer.pushTokens(tokens)
  })
}
