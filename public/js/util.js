function clearSelection() {
  if (window.getSelection) {
    if (window.getSelection().empty) {  // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {  // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {  // IE?
    document.selection.empty();
  }
}

function getMouseCoords(canvas, event) {
  var rectangle = canvas.getBoundingClientRect();
  socket.emit('DEBUG', event.touches);
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
}