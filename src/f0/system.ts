/**
 * System actions
 */

import { lexer } from "./lexer"
import { output } from "../output"
import { execution } from './execution'
import { initEditor, type Editor } from "../editor"
import { initToolbar, type Toolbar } from "../toolbar"
import * as Token from './tokens'
import * as Computer from './computer'
import type { System as ISystem } from '../system'
import { parse } from "./parser"
import { prettyPrintGraph } from "../lib/graphPrinter"

export function formatMetaEntry(key: string, value: any) {
  if (key === 'expression') {
    return Token.printExpression(value)
  }

  return `${key}: ${value}`
}

export class System implements ISystem {
  name = 'f0'
  editor: Editor
  toolbar: Toolbar

  constructor() {
    this.toolbar = initToolbar(this)
    this.editor = initEditor(this)
  }

  init() {
    this.editor.restore()
    this.editor.focus()
    // Machine.init()
    output.restore()

    let unwatch: (() => void) | null = null
    this.toolbar.onWatchMode((enabled) => {
      if (enabled) {
        unwatch = this.editor.onChange(() => {
          this.run()
        })
        this.run()
      } else {
        unwatch?.()
      }
    })

    this.toolbar.onStart(() => {
      this.run()
    })
  }

  getActiveFile() {
    return this.toolbar.getActiveFileState()
  }
  setActiveFileState(content: string) {
    this.toolbar.setActiveFileState(content)
  }
  onFileChange(fn: () => void) {
    return this.toolbar.onFileChange(fn)
  }

  run() {
    const code = this.editor.content
    output.clear()
    execution.reset()


    try {
      const tokens = lexer(code.trim())
      console.log('TOKENS:', tokens)
      const expression = parse(tokens)
      console.log('EXPRESSION:', expression)

      output.traceln('--- Expression ---')
      output.traceln(Token.printExpression(expression))
      // Machine.clear()
      Computer.run(expression)
    } catch(err) {
      if (err instanceof Error) {
        output.uniln(err.toString())
      } else {
        output.uniln(`Unknown error: ${err}`)
      }
    }

    // console.log('GRAPH:', execution.graph())
    output.trace(prettyPrintGraph(execution.graph(), formatMetaEntry))
    output.flush()
  }
}

