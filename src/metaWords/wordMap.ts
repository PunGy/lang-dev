/*****************************************
  * System meta words                    *
  * For every token and meta programming *
  ****************************************/

import type { Computer } from '../compute'

export const metaWordMap = new Map<string, (computer: Computer) => void>()
