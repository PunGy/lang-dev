import { toolbar } from './toolbar'
import { output } from './output';
import * as System from './system'

export interface Editor {
  readonly content: string;
  onChange(fn: (content: string) => void): () => void;
  restore(): void;
  focus(): void;
}

export function initEditor(): Editor {
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
          System.run()
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
      const content = toolbar.getActiveFileState()

      if (content !== null) {
        editorElem.innerText = content
      }
    },
    focus() {
      editorElem.focus()
    },
  }

  editorElem.addEventListener('input', () => {
    const content = editor.content
    toolbar.setActiveFileState(content)
  })

  toolbar.onFileChange(() => {
    editor.restore()
  })

  const getContent = () => editorElem.innerText

  return editor
}

export const editor = initEditor()
