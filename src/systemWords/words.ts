import * as Numeric from './number'
import * as Stack from './stack'
import * as Print from './print'

/**********************
  * System functions: *
  *********************/

export const wordMap = new Map<string, () => void>()
wordMap.set('+', Numeric.plus)
wordMap.set('-', Numeric.minus)
wordMap.set('*', Numeric.mul)
wordMap.set('/', Numeric.div)
wordMap.set('=', Numeric.eq)
wordMap.set('>', Numeric.gt)
wordMap.set('<', Numeric.lt)

wordMap.set('DUP', Stack.dup)
wordMap.set('DROP', Stack.drop)

wordMap.set('.', Print.printPop)
wordMap.set('.P', Print.print)
wordMap.set('.S', Print.printStack)
wordMap.set('PRINT', Print.print)
wordMap.set('PRINT-STACK', Print.printStack)
