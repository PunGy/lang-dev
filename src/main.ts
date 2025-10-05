import { initEditor } from './editor'
import { lexer } from './lexer'
import { initOutput } from './output'
import * as Token from './tokens'
import './style.css'

const editor = initEditor()
const output = initOutput()

editor.onChange(content => {
  process(content)
})

function process(code: string) {
  const tokens = lexer(code)

  output.print(tokens.map(token => Token.print(token)).toString())
}

