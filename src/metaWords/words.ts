/*****************************************
  * System meta words                    *
  * For every token and meta programming *
  ****************************************/

import type { Computer } from '../compute'
import * as Machine from '../machine'
import { output } from '../output'
import * as Token from '../tokens'

type Token = Token.Token

export const metaWordMap = new Map<string, (computer: Computer) => void>()

metaWordMap.set('IF', onIF)
metaWordMap.set(':', newWord)

function onIF(computer: Computer) {
  let lvl = 0
  let terminated = false
  let elseI = -1

  const tokens: Array<Token> = []

  tokenLoop: while (!computer.isAtEnd()) {
    const tok = computer.consume()!

    if (tok.type === Token.tword) {
      switch (tok.word) {
        case 'IF':
          lvl++;
          break
        case 'ELSE':
          if (lvl === 0) {
            elseI = tokens.length
          }
          break
        case 'THEN':
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
    throw new Error(`Unterminated if condition!`)
  }

  const flagTok = Machine.pop()

  if (flagTok === undefined || flagTok.type !== Token.tbool) {
    throw new Error(`IF: (bool) must be on top of the stack!`)
  }

  const flag = flagTok.value

  if (elseI > -1) {
    // if else then
    if (flag) {
      output.println(`--- IF (.) ELSE THEN ---`)
      output.print(`|->`)
      computer.pushTokens(tokens.slice(0, elseI))
    } else {
      output.println(`--- IF ELSE (.) THEN ---`)
      output.print(`|->`)
      computer.pushTokens(tokens.slice(elseI + 1))
    }
  } else {
    // if then
    if (flag) {
      output.println(`--- IF (.) THEN ---`)
      output.print(`|->`)
      computer.pushTokens(tokens)
    } else {
      output.println(`--- IF (-) THEN ---`)
    }
  }
}

function newWord(computer: Computer) {
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
    computer.pushTokens(tokens)
  })
}

