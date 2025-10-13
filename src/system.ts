/**
 * System actions
 */

import { Computer } from "./compute"
import { editor } from "./editor"
import { lexer } from "./lexer"
import { output } from "./output"
import * as Machine from './machine'
import { execution } from "./executionGraph"
import { prettyPrintGraph } from "./lib/graphPrinter"

export function run() {
  const code = editor.content
  output.clear()
  execution.reset()

  try {
    const tokens = lexer(code)

    // output.print(tokens.map(token => Token.print(token)).toString() + "\n\n")
    const computer = new Computer(tokens)
    Machine.clear()
    computer.run()
  } catch(err) {
    if (err instanceof Error) {
      output.uniln(err.toString())
    } else {
      output.uniln(`Unknown error: ${err}`)
    }
  }

  console.log(execution.graph())
  output.trace(prettyPrintGraph(execution.graph()))
  output.flush()
}
