const pdf = require('pdf-parse');

async function parsePdf(pdfBuffer) {
  const data = await pdf(pdfBuffer);
  return {
    text: data.text,
    extractedTitle: data.info?.Title || 'Untitled',
  };
}

function extractTitleFromText(text) {
  const sentences = text.trim().split(/(?<=[.?!])\s+/);
  return sentences.slice(0, 1).join(' ').slice(0, 100) || 'Untitled';
}

module.exports = {
  parsePdf, extractTitleFromText,
};
