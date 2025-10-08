import { editor } from './editor'
import * as Machine from './machine'
import * as System from './system'
import './style.css'
import { toolbar } from './toolbar'

Machine.init()

editor.restore()

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

