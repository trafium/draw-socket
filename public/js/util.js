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
  $canvas = $(canvas);
  return {
    x: event.pageX - $canvas.position().left,
    y: event.pageY - $canvas.position().top
  };
}