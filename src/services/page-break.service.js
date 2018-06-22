export function isElementInsideCurrentSheet(element) {
  const parentSheet = element.closest('.sheet');
  const sheetOffset = parentSheet.offset() || { top: 0 };
  const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
  const totalPageHeight = sheetOffset.top + paddingTop + (parentSheet.height() || 0);
  // parentSheet.parent().append(`<hr style="position:absolute; top:${totalPageHeight}px;width:100%; border-color:red; margin:0">`);
  const elementOffset = element.offset() || { top: 0 };
  const elementBottom = elementOffset.top + (element.height() || 0);
  // log.info('closest(.sheet)', parentSheet);
  // log.info('totalPageHeight', totalPageHeight);
  // log.info('elementBottom', elementBottom);
  return elementBottom < totalPageHeight;
}
