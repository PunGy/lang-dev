import type { System } from "./system";

export enum ProgramState {
  READY = 'ready',
  RUNNING = 'running',
}
export interface Toolbar {
  state: ProgramState;
  setState(nextState: ProgramState): void;
  onStart(handler: () => void): void;
  onStop(handler: () => void): void;
  onFileChange(handler: (file: string) => void): void;
  onWatchMode(handler: (enabled: boolean) => void): void;
  getActiveFileState(): string | null;
  setActiveFileState(content: string): void;
  hideButtons(): void;
}

function isHTMLElement(obj: unknown): obj is HTMLElement {
  // TBD
  return obj instanceof HTMLElement
}

export const ACTIVE_FILE = 'active-file'
const FILES = 'files'

export function initToolbar(system: System): Toolbar {
  const toolbarElem = document.getElementById('toolbar')
  const startButton = document.getElementById('start-button')
  const stopButton = document.getElementById('stop-button')
  const watchModeCheckbox = document.getElementById('watch-checkbox') as HTMLInputElement
  const fileDropdownToggle = document.getElementById('select-file-button')
  const fileDropdown = document.getElementById('file-popup')
  const newFileButton = document.getElementById('file-new-option')
  const fileInput = document.getElementById('file-name') as HTMLInputElement

  if (!toolbarElem 
    ||!startButton 
    ||!stopButton 
    ||!watchModeCheckbox
    ||!newFileButton
    ||!fileDropdown
    ||!fileDropdownToggle
    ||!fileInput
  ){
    throw new Error('No toolbar in the application!')
  }

  let watchMode = false
  let startFn: (() => void) | undefined;
  let watchModeFn: (() => void) | undefined;
  let fileChangeFn: ((file: string) => void) | undefined;
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

    onFileChange(fn) {
      fileChangeFn = fn
    },

    getActiveFileState() {
      return localStorage.getItem(prefixed(`file-${activeFile}`))
    },
    setActiveFileState(content) {
      localStorage.setItem(prefixed(`file-${activeFile}`), content)
    },
  }

  const prefixed = (req: string) => {
    return `${system.name}/${req}`
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

  /**
   * File Management
   */

  const updateFile = (oldFile: string, newFile: string) => {
    const elem = files.get(oldFile)

    if (!elem) {
      throw new Error(`No such file as ${elem}`)
    }

    const text = elem.firstElementChild
    if (!text || !isHTMLElement(text)) {
      throw new Error(`Cannot set text for tab ${oldFile}!`)
    }
    text.innerText = newFile
    elem.dataset.file = newFile
    const oldId = prefixed(`file-${oldFile}`)
    const content = localStorage.getItem(oldId)
    if (content === null) {
      throw new Error(`No content for ${oldFile}`)
    }
    localStorage.removeItem(oldId)
    localStorage.setItem(prefixed(`file-${newFile}`), content)

    files.delete(oldFile)
    files.set(newFile, elem)
    syncFiles()
  }
  const setActiveFile = (file: string) => {
    activeFile = file
    fileInput.value = file
    localStorage.setItem(prefixed(ACTIVE_FILE), file)
  }
  const saveActiveFileName = (newName: string) => {
    updateFile(activeFile, newName)
    setActiveFile(newName)
  }
  const makeFile = (file: string) => {
    const fileId = prefixed(`file-${file}`)
    if (!files.has(file)) {
      files.set(file, null)
    }

    const elem = document.createElement('div')
    const text = document.createElement('span')
    text.innerText = file
    text.dataset.file = file
    elem.appendChild(text)
    elem.classList.add('file-option')
    elem.dataset.file = file
    const close = document.createElement('div')
    close.innerText = 'X'
    close.classList.add('button', 'close-button')
    elem.appendChild(close)

    files.set(file, elem)

    if (localStorage.getItem(fileId) === null) {
      localStorage.setItem(fileId, '')
    }

    fileDropdown.prepend(elem)
  }
  const removeFile = (file: string) => {
    if (!files.has(file)) {
      throw new Error(`No such file to delete ${file}`)
    }

    files.get(file)!.remove()
    files.delete(file)
    localStorage.removeItem(prefixed(`file-${file}`))
  }
  const initializeFiles = () => {
    const list = localStorage.getItem(prefixed(FILES))?.split('<|>') ?? []
    const map = new Map<string, HTMLElement | null>()
    list.forEach(file => {
      map.set(file, null)
    })

    return map
  }
  const serializeFiles = () => {
    return Array.from(files.keys()).join('<|>')
  }

  const syncFiles = () => {
    localStorage.setItem(prefixed(FILES), serializeFiles())
  }

  let activeFile = localStorage.getItem(prefixed(ACTIVE_FILE))!
  const files = initializeFiles()

  if (!activeFile) {
    // first open
    setActiveFile('Main')
    files.set(activeFile, null)
  }
  fileInput.value = activeFile
  files.forEach((_, file) => {
    makeFile(file)
  })

  fileInput.addEventListener('change', () => {
    saveActiveFileName(fileInput.value)
  })

  fileDropdown.addEventListener('click', (event) => {
    const { target } = event
    if (!target || !isHTMLElement(target)) {
      return
    }
    event.stopPropagation()

    let file: string;
    if (target === newFileButton) {
      // make new file
      file = 'File'

      let counter = 1;
      if (files.has(file)) {
        file += ' ' + counter
      }
      while (files.has(file)) {
        file = file.split(' ').slice(0, -1).join(' ') + ' ' + (++counter)
      }

      makeFile(file)
      setActiveFile(file)
      hideDropdown()
    } else if (target.classList.contains('close-button')) {
      // remove file
      file = target.parentElement?.dataset.file!
      if (!file) {
        throw new Error('Cannot get name of file to delete!')
      }
      const nextFile = target.parentElement!.nextElementSibling
      if (!nextFile || !isHTMLElement(nextFile)) {
        throw new Error('Cannot determine next file name')
      }

      removeFile(file)

      if (file !== activeFile) {
        syncFiles()
        return
      }

      if (nextFile === newFileButton) {
        file = 'File'
        makeFile(file)
      } else {
        file = nextFile.dataset.file!
      }

      setActiveFile(file)
    } else {
      // select file
      file = target.dataset.file!
      if (!files.get(file)) {
        throw new Error(`Unknown element for ${file}`)
      }
      setActiveFile(file)
    }
    syncFiles()

    if (fileChangeFn) {
      fileChangeFn(file)
    }
  })

  // dropdown showing functions

  const showDropdown = () => {
    fileDropdown.classList.add('show')
  }
  const hideDropdown = () => {
    fileDropdown.classList.remove('show')
  }

  document.addEventListener('click', () => {
    hideDropdown()
  })

  fileDropdownToggle.addEventListener('click', (event) => {
    event.stopPropagation()
    const isShown = fileDropdown.classList.contains('show')
    if (isShown) {
      hideDropdown()
    } else {
      showDropdown()
    }
  })


  /**
   * Program start actions
   */

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

