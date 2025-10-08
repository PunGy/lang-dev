export interface Editor {
  content: string;
  onChange(fn: (content: string) => void): () => void;
  restore(): void;
}

const PERSISTENCE_KEY = 'editor-state'

export function initEditor(): Editor {
  const editorElem = document.getElementById('editor')

  if (!editorElem) {
    throw new Error('No editor in the application!')
  }

  editorElem.addEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.key) {
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
    }
  });

  const editor: Editor = {
    get content() {
      return getContent()
    },
    onChange(fn) {
      const handler = () => {
        const content = this.content
        localStorage.setItem(PERSISTENCE_KEY, content)
        fn(content)
      }
      editorElem.addEventListener('input', handler)
      return () => {
        editorElem.removeEventListener('input', handler)
      }
    },
    restore() {
      const content = localStorage.getItem(PERSISTENCE_KEY)

      if (content) {
        editorElem.innerText = content
      }
    }
  }

  const getContent = () => editorElem.innerText

  return editor
}
