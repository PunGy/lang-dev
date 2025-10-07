export interface Output {
  clear(): void;
  print(content: string): void;
  println(content: string): void;
  flush(): void;
}
export const initOutput = (): Output => {
  const outputElem = document.getElementById('output')

  if (!outputElem) {
    throw new Error('No output in the application!')
  }

  let buffer = ''
  return {
    clear() {
      outputElem.innerText = ''
      buffer = ''
    },
    print(content) {
      return buffer += content
    },
    println(content) {
      return this.print(content + '\n')
    },
    flush() {
      outputElem.innerText = buffer
      buffer = ''
    },
  }
}

export const output = initOutput()
