const attributesRegexp = /(<\/?\w+)(.|\n)*?(\/?>)/g;
const emptyTagsRegexp = /<([a-z][a-z0-9]*)\b[^>]*>\s*<\/\1>/gi;
const commentsRegexp = /<!--[\s\S]*?-->/g;

export const domElementToText = (destination: Element | null): string => {
  if (!destination) return "";

  // Создаем временный элемент для сбора текста
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(destination.cloneNode(true) as Element);

  const excludeSelectors = ["script", "style", "form", "input", "noscript", "link"];

  excludeSelectors.forEach(selector => {
    tempDiv.querySelectorAll(selector)
      .forEach(el => {
        el.remove()
      })
  })

  const removeEmptyTags = (element: Element) => {
    Array.from(element.children)
      .forEach((child) => {
        removeEmptyTags(child);
        if (child.innerHTML.replace(/\s+/g, "").length === 0)
          child.remove();
      })
  };
  removeEmptyTags(tempDiv);
  return tempDiv.innerHTML
    .replace(attributesRegexp, "$1$3")
    .replace(emptyTagsRegexp, '')
    .replace(commentsRegexp, '')
    .replace(/\s+/g, ' ');
};
