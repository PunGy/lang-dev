import * as Machine from './machine'
import * as System from './system'
import './style.css'
// Toolbar must go before edit (poor design fix this crap OMG)
import { toolbar } from './toolbar'
import { editor } from './editor'
import { output } from './output'

Machine.init()

editor.restore()
editor.focus()
output.restore()

let unwatch: (() => void) | null = null
toolbar.onWatchMode((enabled) => {
  if (enabled) {
    unwatch = editor.onChange(() => {
      System.run()
    })
    System.run()
  } else {
    unwatch?.()
  }
})

toolbar.onStart(() => {
  System.run()
})

