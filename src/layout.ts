const resizer = document.getElementById('container-separator');
const leftPane = document.getElementById('editor-container');
const rightPane = document.getElementById('output-container');
const app = document.getElementById('app');

if (!resizer || !leftPane || !rightPane || !app) {
  throw new Error("Required elements not found on the page!");
}

const minPaneWidth = 100;

const onMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return;
  e.preventDefault();

  const startX = e.clientX;
  const startLeftWidth = leftPane.getBoundingClientRect().width;

  resizer.classList.add('is-dragging');
  document.body.classList.add('is-resizing');

  const onMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    let newLeftWidth = startLeftWidth + deltaX;

    const containerWidth = app.getBoundingClientRect().width;

    const maxPaneWidth = containerWidth - resizer.offsetWidth - minPaneWidth;
    newLeftWidth = Math.max(minPaneWidth, Math.min(newLeftWidth, maxPaneWidth));

    requestAnimationFrame(() => {
      app.style.gridTemplateColumns = `${newLeftWidth}px ${resizer.offsetWidth}px auto`;
    });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    resizer.classList.remove('is-dragging');
    document.body.classList.remove('is-resizing');
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

resizer.addEventListener('mousedown', onMouseDown);
