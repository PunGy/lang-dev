export enum ProgramState {
  READY = 'ready',
  RUNNING = 'running',
}
export interface Toolbar {
  state: ProgramState;
  setState(nextState: ProgramState): void;
  onStart(handler: () => void): void;
  onStop(handler: () => void): void;
  onWatchMode(handler: (enabled: boolean) => void): void;
  hideButtons(): void;
}

export function initToolbar(): Toolbar {
  const toolbarElem = document.getElementById('toolbar')
  const startButton = document.getElementById('start-button')
  const stopButton = document.getElementById('stop-button')
  const watchModeCheckbox = document.getElementById('watch-checkbox') as HTMLInputElement

  if (!toolbarElem || !startButton || !stopButton || !watchModeCheckbox) {
    throw new Error('No toolbar in the application!')
  }

  let watchMode = false
  let startFn: (() => void) | undefined;
  let watchModeFn: (() => void) | undefined;
  const toolbar: Toolbar = {
    state: ProgramState.READY,
    onStart(fn) {
      startFn = () => {
        if (this.state === ProgramState.RUNNING) {
          return
        }
        fn()
      }
    },
    onStop() {
      // TBD
    },

    onWatchMode(handler) {
      watchModeFn = () => {
        if (watchMode) {
          hideStart()
        } else {
          showStart()
        }
        handler(watchMode)
      }
    },

    hideButtons() {
      hideStart()
      hideStop()
    },

    setState(nextState) {
      this.state = nextState
    },
  }

  const hideStart = () => {
    startButton.style.display = 'none'
  }
  const showStart = () => {
    startButton.style.display = 'block'
  }
  const hideStop = () => {
    stopButton.style.display = 'none'
  }

  startButton.addEventListener('click', () => {
    if (startFn) {
      startFn()
    }
  })
  stopButton.addEventListener('click', () => {
    // TBD
  })
  watchModeCheckbox.addEventListener('input', () => {
    watchMode = watchModeCheckbox.checked
    if (watchModeFn) {
      watchModeFn()
    }
  })

  return toolbar
}

export const toolbar = initToolbar()
