import * as Machine from './machine'
import * as System from './system'
import '../style.css'
import { toolbar } from '../toolbar'
import { editor } from '../editor'
import { output } from '../output'
import '../layout'

Machine.init()

editor.restore()
editor.focus()
output.restore()

editor.initSystem(System)

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

