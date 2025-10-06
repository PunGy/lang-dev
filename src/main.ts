import { initEditor } from './editor'
import { lexer } from './lexer'
import { output } from './output'
import * as Token from './tokens'
import './style.css'
import { compute } from './compute'

const editor = initEditor()

editor.onChange(content => {
  process(content)
})

function process(code: string) {
  try {
    const tokens = lexer(code)

    output.clear()
    output.print(tokens.map(token => Token.print(token)).toString())
    output.print("\n\n --- COMPUTATION --- \n\n")

    compute.prepare()
    const result = compute(tokens)
    output.print(Token.print(result))
  } catch(err) {
    if (err instanceof Error) {
      output.print(err.toString())
    } else {
      output.print(`Unknown error: ${err}`)
    }
  }
}

