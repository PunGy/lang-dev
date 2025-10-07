import * as Branch from './branching'
import * as Environment from './environment'
import { metaWordMap } from './wordMap'

/**
  * Meta words registration
  */

export function initMetaWords() {
  metaWordMap.set('IF', Branch.IF)
  metaWordMap.set('BEGIN', Branch.beginLoop)
  metaWordMap.set(':', Environment.newWord)
}
