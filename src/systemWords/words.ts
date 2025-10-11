import * as Numeric from './number'
import * as Stack from './stack'
import * as Print from './print'
import * as Bool from './bool'
import * as String from './string'
import { wordMap } from './wordMap'

/**
  * Stack words registration
  */

export function initSystemWords() {
  wordMap.set('+', Numeric.plus)
  wordMap.set('-', Numeric.minus)
  wordMap.set('*', Numeric.mul)
  wordMap.set('/', Numeric.div)
  wordMap.set('=', Numeric.eq)
  wordMap.set('>', Numeric.gt)
  wordMap.set('<', Numeric.lt)

  wordMap.set('\'+', String.plus)
  wordMap.set('\'*', String.mul)
  wordMap.set('\'=', String.eq)
  wordMap.set('\'LEN', String.len)
  wordMap.set('\'I', String.index)

  wordMap.set('NOT', Bool.not)

  wordMap.set('DUP', Stack.dup)
  wordMap.set('DROP', Stack.drop)
  wordMap.set('SWAP', Stack.swap)
  wordMap.set('OVER', Stack.over)
  wordMap.set('EMPTY?', Stack.isEmpty)
  wordMap.set('STACK-LEN', Stack.len)
  wordMap.set('PICK', Stack.pick)

  wordMap.set('.', Print.printPop)
  wordMap.set('.P', Print.print)
  wordMap.set('.S', Print.printStack)
  wordMap.set('PRINT', Print.print)
  wordMap.set('PRINT-STACK', Print.printStack)
}
