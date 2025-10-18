import { editor } from '../editor'
import { output } from '../output'
import { execution } from './execution'
import { lexer } from './lexer'

export function run() {
  const code = editor.content
  output.clear()
  execution.reset()


  try {
    const tokens = lexer(code)
    console.log('TOKENS:', tokens)

    // output.print(tokens.map(token => Token.print(token)).toString() + "\n\n")
    // const computer = new Computer(tokens)
    // Machine.clear()
    // computer.run()
  } catch(err) {
    if (err instanceof Error) {
      output.uniln(err.toString())
    } else {
      output.uniln(`Unknown error: ${err}`)
    }
  }

  // console.log('GRAPH:', execution.graph())
  // output.trace(prettyPrintGraph(execution.graph(), formatMetaEntry))
  output.flush()
}
