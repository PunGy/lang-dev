/**
 * System actions
 */

import { Computer } from "./compute"
import { editor } from "./editor"
import { lexer } from "./lexer"
import { output } from "./output"
import * as Machine from './machine'

export function run() {
  const code = editor.content
  output.clear()

  try {
    const tokens = lexer(code)

    // output.print(tokens.map(token => Token.print(token)).toString() + "\n\n")
    output.print("--- COMPUTATION ---\n\n")

    const computer = new Computer(tokens)
    Machine.clear()
    computer.run()
  } catch(err) {
    if (err instanceof Error) {
      output.print(err.toString())
    } else {
      output.print(`Unknown error: ${err}`)
    }
  }

  output.flush()
}
