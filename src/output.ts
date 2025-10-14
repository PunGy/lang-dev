export interface Output {
  clear(): void;
  clearOutput(): void;
  clearTrace(): void;
  print(content: string): void;
  println(content: string): void;
  trace(content: string): void;
  traceln(content: string): void;
  uni(content: string): void;
  uniln(content: string): void;
  flush(): void;

  showTrace(): void;
  showOutput(): void;
  showDocs(): void;

  restore(): void;
}

const PERSISTENCE_KEY = 'tab-state'

export const initOutput = (): Output => {
  const tracePanel = document.getElementById('trace')
  const outputPanel = document.getElementById('output')
  const docsPanel = document.getElementById('docs')

  if (!outputPanel
    ||!docsPanel
    ||!tracePanel
    ) {
    throw new Error('No panels!')
  }

  const traceButton = document.getElementById('trace-tab')
  const outputButton = document.getElementById('output-tab')
  const docsButton = document.getElementById('docs-tab')
  if (!traceButton
    ||!outputButton
    ||!docsButton
    ) {
    throw new Error('No tab buttons!')
  }

  let active = {
    button: traceButton,
    panel: tracePanel,
  }

  const clearActive = () => {
    active.panel.classList.remove('active')
    active.button.classList.remove('active')
  }

  const showTrace = () => {
    clearActive()

    tracePanel.classList.add('active')
    traceButton.classList.add('active')
    active = {
      button: traceButton,
      panel: tracePanel,
    }
    localStorage.setItem(PERSISTENCE_KEY, 'trace')
  }
  const showOutput = () => {
    clearActive()
    outputPanel.classList.add('active')
    outputButton.classList.add('active')
    active = {
      button: outputButton,
      panel: outputPanel,
    }

    localStorage.setItem(PERSISTENCE_KEY, 'output')
  }
  const showDocs = () => {
    clearActive()
    docsPanel.classList.add('active')
    docsButton.classList.add('active')
    active = {
      button: docsButton,
      panel: docsPanel,
    }

    localStorage.setItem(PERSISTENCE_KEY, 'docs')
  }
  traceButton.addEventListener('click', () => {
    showTrace()
  })
  outputButton.addEventListener('click', () => {
    showOutput()
  })
  docsButton.addEventListener('click', () => {
    showDocs()
  })

  let outputBuffer = ''
  let traceBuffer = ''
  return {
    clearOutput() {
      outputPanel.innerText = ''
      outputBuffer = ''
    },
    clearTrace() {
      tracePanel.innerText = ''
      traceBuffer = ''
    },
    clear() {
      this.clearOutput()
      this.clearTrace()
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

      switch (state) {
        case 'trace':
          return showTrace()
        case 'output':
          return showOutput()
        case 'docs':
          return showDocs()
        default:
          return showDocs()
      }
    },
    showTrace,
    showOutput,
    showDocs,
  }
}

export const output = initOutput()
