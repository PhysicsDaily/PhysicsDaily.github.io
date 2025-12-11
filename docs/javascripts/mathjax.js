window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    tags: 'ams'
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

const renderMath = () => {
  const mathjax = window.MathJax
  if (!mathjax?.typesetPromise) return

  const { startup, typesetClear, texReset } = mathjax
  startup?.output?.clearCache?.()
  typesetClear?.()
  texReset?.()
  return mathjax.typesetPromise()
}

if (typeof document$ !== "undefined") {
  document$.subscribe(renderMath)
}

window.addEventListener("load", renderMath)
