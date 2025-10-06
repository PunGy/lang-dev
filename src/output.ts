export interface Output {
  clear(): void;
  print(content: string): void;
  println(content: string): void;
}
export const initOutput = (): Output => {
  const outputElem = document.getElementById('output')

  if (!outputElem) {
    throw new Error('No output in the application!')
  }

  return {
    clear() {
      outputElem.innerText = ''
    },
    print(content) {
      return outputElem.innerText += content
    },
    println(content) {
      return this.print(content + '\n')
    },
  }
}

export const output = initOutput()
