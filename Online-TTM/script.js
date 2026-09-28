const copyButton = document.querySelector('#copy-bibtex');
const bibtex = document.querySelector('#bibtex');
const copyStatus = document.querySelector('#copy-status');

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(bibtex.textContent.trim());
    copyButton.textContent = 'Copied';
    copyStatus.textContent = 'BibTeX copied to clipboard.';
  } catch (error) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(bibtex);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'BibTeX selected. Press Ctrl+C or Command+C to copy.';
  }

  window.setTimeout(() => {
    copyButton.textContent = 'Copy BibTeX';
    copyStatus.textContent = '';
  }, 2400);
});
