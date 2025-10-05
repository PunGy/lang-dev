export interface Output {
  print(content: string): void;
}
export const initOutput = (): Output => {
  const outputElem = document.getElementById('output')

  if (!outputElem) {
    throw new Error('No output in the application!')
  }

  return {
    print(content) {
      return outputElem.innerText = content
    }
  }
}
