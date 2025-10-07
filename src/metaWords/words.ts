import * as Branch from './branching'
import * as Environment from './environment'
import { metaWordMap } from './wordMap'

/**
  * Meta words registration
  */

metaWordMap.set('IF', Branch.IF)
metaWordMap.set(':', Environment.newWord)

