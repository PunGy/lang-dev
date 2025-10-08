import type { Computer } from '../compute'
import * as Machine from '../machine'
import { output } from '../output'
import * as Token from '../tokens'

type Token = Token.Token

export function IF(computer: Computer) {
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
      output.traceln(`--- IF (.) ELSE THEN ---`)
      output.trace(`|->`)
      computer.pushTokens(tokens.slice(0, elseI))
    } else {
      output.traceln(`--- IF ELSE (.) THEN ---`)
      output.trace(`|->`)
      computer.pushTokens(tokens.slice(elseI + 1))
    }
  } else {
    // if then
    if (flag) {
      output.traceln(`--- IF (.) THEN ---`)
      output.trace(`|->`)
      computer.pushTokens(tokens)
    } else {
      output.traceln(`--- IF (-) THEN ---`)
    }
  }
}

export function beginLoop(computer: Computer) {
  let loopsCount = 0;
  let terminated = false

  const tokens: Array<Token> = []

  const tokenLoop = () => {
    loopsCount++;
    if (loopsCount > 100_000) {
      throw new Error('100_000 iterations of the loop... Seems like unterminated infinite loop')
    }
    while (!computer.isAtEnd()) {
      // peek, because we don't need to skip "until" word
      const tok = computer.peek()!

      if (tok.type === Token.tword && tok.word === 'UNTIL') {
        terminated = true
        return
      }
      if (!terminated) {
        tokens.push(tok)
      }
      computer.skip()
      computer.execute(tok)
    }
  }
  tokenLoop()

  if (!terminated) {
    throw new Error('Unterminated loop! Insert UNTIL')
  }

  let flag: boolean
  while (true) {
    const flagTok = Machine.pop()

    if (flagTok === undefined || flagTok.type !== Token.tbool) {
      throw new Error(`UNTIL: (bool) must be on top of the stack!`)
    }

    flag = flagTok.value

    if (!flag) {
      computer.pushTokens(tokens)
      tokenLoop()
    } else {
      computer.skip() // skip "UNTIL"
      break
    }
  }
}
