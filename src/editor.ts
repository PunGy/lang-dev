import { output } from './output';
import type { System } from './system';

export interface Editor {
  readonly content: string;
  onChange(fn: (content: string) => void): () => void;
  restore(): void;
  focus(): void;
  initSystem(system: System): void;
}

export function initEditor(system: System): Editor {
  const editorElem = document.getElementById('editor')

  if (!editorElem) {
    throw new Error('No editor in the application!')
  }

  editorElem.addEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Tab':
        e.preventDefault();
        document.execCommand('insertText', false, '  ')
        break
      case 'Enter': {
        e.preventDefault()

        const selection = window.getSelection()
        if (!selection?.rangeCount) return

        const range = selection.getRangeAt(0)
        const textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) ?? ''
        const currentLine = textBeforeCursor.split('\n').pop() ?? ''

        const indentationMatch = currentLine.match(/^[\s\t]*/)
        const indentation = indentationMatch ? indentationMatch[0] : ''

        document.execCommand('insertText', false, '\n' + indentation)
        break
      }
      case 'KeyS':
        if (e.ctrlKey) {
          e.preventDefault()
          system.run()
          return
        }
        break
      case 'KeyO':
        if (e.ctrlKey) {
          e.preventDefault()
          output.showOutput();
        }
        break
      case 'KeyI':
        if (e.ctrlKey) {
          e.preventDefault()
          output.showTrace();
        }
        break
      case 'KeyH':
        if (e.ctrlKey) {
          e.preventDefault()
          output.showDocs();
        }
        break
    }
  });

  const editor: Editor = {
    get content() {
      return getContent()
    },

    onChange(fn) {
      const handler = () => {
        fn(editor.content)
      }
      editorElem.addEventListener('input', handler)
      return () => {
        editorElem.removeEventListener('input', handler)
      }
    },
    restore() {
      if (!system) {
        return
      }
      const content = system.getActiveFile()

      if (content !== null) {
        editorElem.innerText = content
      }
    },
    focus() {
      editorElem.focus()
    },

    initSystem(s) {
      system = s
    },
  }

  editorElem.addEventListener('input', () => {
    const content = editor.content
    system.setActiveFileState(content)
  })

  system.onFileChange(() => {
    editor.restore()
  })

  const getContent = () => editorElem.innerText

  return editor
}

