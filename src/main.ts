import { initEditor } from './editor'
import { lexer } from './lexer'
import { output } from './output'
import * as Token from './tokens'
import * as Machine from './machine'
import './style.css'
import { Computer } from './compute'
import { initToolbar } from './toolbar'

const editor = initEditor()
const toolbar = initToolbar()
Machine.init()

editor.restore()

let unwatch: (() => void) | null = null
toolbar.onWatchMode((enabled) => {
  if (enabled) {
    unwatch = editor.onChange(content => {
      process(content)
    })
    process(editor.content)
  } else {
    unwatch?.()
  }
})

toolbar.onStart(() => {
  process(editor.content)
})

function process(code: string) {
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

