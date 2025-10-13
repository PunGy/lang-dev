/**
 * Utils for making system words
 */
import * as Token from '../tokens'
import * as Machine from '../machine'
import { output } from '../output'
import { execution } from '../executionGraph'

export function wrongParamMessage(word: string, paramMessage: string, got: string) {
  return `${word}: require ${paramMessage} on top of stack! Got: ${got}`
}

export const printTypes = (types: readonly Token.LiteralType[]) => `(${types.map(Token.printType).join(' ')})`
export function makePureFn<const Ts extends readonly Token.LiteralType[], Vs extends { [K in keyof Ts]: Token.LiteralType2Value[Ts[K]] }, O extends Token.LiteralType>(
  name: string,
  params: Ts,
  outType: O,
  expr: (params: Vs) => Token.LiteralType2Value[O],
  debugExpr: (params: Vs) => string,
  debugName = name
) {
  const paramsCount = params.length
  const paramsString = printTypes(params)
  const fnName = debugName.toUpperCase()
  const wrongUse = wrongParamMessage.bind(null, name, paramsString)

  return () => {
    const meta = { view: '' }
    execution.beginBlockOperation(fnName, meta)

    if (Machine.isEmpty()) {
      throw new Error(wrongUse('nothing!'))
    }

    const values = []

    for (let i = 0; i < paramsCount; i++) {
      const n = Machine.pop()

      if (n === undefined) {
        throw new Error(wrongUse(printTypes(params.slice(0, i))))
      }
      if (n.type !== params[i]!) {
        throw new Error(wrongUse(printTypes(params.slice(0, i).concat([n.type]))))
      }

      values.push(n.value)
    }

    let make: (value: Token.LiteralType2Value[O]) => Token.LiteralType2Token[O];
    switch (outType) {
      case Token.tnum: 
        // @ts-ignore sad :(
        make = Token.makeNumber
        break
      case Token.tstr:
        // @ts-ignore sad :(
        make = Token.makeString
        break
      case Token.tbool:
        // @ts-ignore sad :(
        make = Token.makeBool
        break
    }

    const value = make(expr(values as unknown as Vs))
    Machine.push(value)
    meta.view = `${debugExpr(values as unknown as Vs)}: ${Token.printLiteral(value)}`
    execution.endBlockOperation();
  }
}
