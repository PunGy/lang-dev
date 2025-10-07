export interface Editor {
  content: string;
  onChange(fn: (content: string) => void): void;
  restore(): void;
}

const PERSISTENCE_KEY = 'editor-state'

export function initEditor(): Editor {
  const editorElem = document.getElementById('editor')

  if (!editorElem) {
    throw new Error('No editor in the application!')
  }

  const editor: Editor = {
    get content() {
      return getContent()
    },
    onChange(fn) {
      editorElem.addEventListener('input', () => {
        const content = this.content


        localStorage.setItem(PERSISTENCE_KEY, content)
        fn(content)
      })
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
