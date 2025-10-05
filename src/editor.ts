export interface Editor {
  content: string;
  onChange(fn: (content: string) => void): void;
}

export function initEditor(): Editor {
  const editorElem = document.getElementById('editor')

  if (!editorElem) {
    throw new Error('No editor in the application!')
  }

  const getContent = () => editorElem.innerText

  return {
    get content() {
      return getContent()
    },
    onChange(fn) {
      editorElem.addEventListener('input', () => {
        fn(getContent())
      })
    },
  }
}
