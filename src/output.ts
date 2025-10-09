export interface Output {
  clear(): void;
  clearOutput(): void;
  print(content: string): void;
  println(content: string): void;
  trace(content: string): void;
  traceln(content: string): void;
  uni(content: string): void;
  uniln(content: string): void;
  flush(): void;

  showTrace(): void;
  showOutput(): void;

  restore(): void;
}

const PERSISTENCE_KEY = 'tab-state'

export const initOutput = (): Output => {
  const tracePanel = document.getElementById('trace')
  const outputPanel = document.getElementById('output')

  if (!outputPanel) {
    throw new Error('No output in the application!')
  }
  if (!tracePanel) {
    throw new Error('No trace block in the application!')
  }

  const traceButton = document.getElementById('trace-tab')
  const outputButton = document.getElementById('output-tab')
  if (!traceButton || !outputButton) {
    throw new Error('No tab buttons!')
  }

  const showTrace = () => {
    tracePanel.classList.add('active')
    traceButton.classList.add('active')

    outputPanel.classList.remove('active')
    outputButton.classList.remove('active')
    localStorage.setItem(PERSISTENCE_KEY, 'trace')
  }
  const showOutput = () => {
    tracePanel.classList.remove('active')
    traceButton.classList.remove('active')

    outputPanel.classList.add('active')
    outputButton.classList.add('active')
    localStorage.setItem(PERSISTENCE_KEY, 'output')
  }
  traceButton.addEventListener('click', () => {
    showTrace()
  })
  outputButton.addEventListener('click', () => {
    showOutput()
  })

  let outputBuffer = ''
  let traceBuffer = ''
  return {
    clear() {
      this.clearOutput()
    },
    clearOutput() {
      outputPanel.innerText = ''
      outputBuffer = ''
    },
    print(content) {
      return outputBuffer += content
    },
    println(content) {
      return this.print(content + '\n')
    },
    trace(content) {
      return traceBuffer += content
    },
    traceln(content) {
      return this.trace(content + '\n')
    },
    uni(content) {
      this.print(content)
      this.trace(content)
    },
    uniln(content) {
      this.uni(content + '\n')
    },
    flush() {
      if (outputBuffer === '') {
        outputBuffer = '[NO OUTPUT]'
      }
      outputPanel.innerText = outputBuffer
      outputBuffer = ''

      tracePanel.innerText = traceBuffer
      traceBuffer = ''
    },
    restore() {
      const state = localStorage.getItem(PERSISTENCE_KEY)

      if (state === 'trace') {
        showTrace()
      } else if (state === 'output') {
        showOutput()
      }
    },
    showTrace,
    showOutput,
  }
}

export const output = initOutput()
