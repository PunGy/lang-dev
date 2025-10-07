import { initEditor } from './editor'
import { lexer } from './lexer'
import { output } from './output'
import * as Token from './tokens'
import * as Machine from './machine'
import './style.css'
import { Computer } from './compute'

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

    const computer = new Computer(tokens)
    Machine.clear()
    computer.compute()
  } catch(err) {
    if (err instanceof Error) {
      output.print(err.toString())
    } else {
      output.print(`Unknown error: ${err}`)
    }
  }
}

