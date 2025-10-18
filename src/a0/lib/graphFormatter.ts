import * as Token from "../tokens";

export function formatMetaEntry(key: string, value: any) {
  let v;

  if (key === 'view') {
    return value
  }

  if (Token.isToken(value)) {
    if (Token.isLiteral(value)) {
      return Token.printLiteral(value)
    } else {
      v = Token.print(value)
    }
  } else {
    v = JSON.stringify(value)
  }

  return `${key}: ${v}`
}
