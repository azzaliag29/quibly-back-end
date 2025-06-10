function extractTitleFromText(text) {
  const sentences = text.trim().split(/(?<=[.?!])\s+/);
  return sentences.slice(0, 1).join(' ').slice(0, 100) || 'Untitled';
}

function generateIdSummary(text) {
  // untuk demo
  return `Ringkasan (ID): ${text.slice(0, 50)}...`;
}

function generateEnSummary(text) {
  // untuk demo
  return `Summary (EN): ${text.slice(0, 50)}...`;
}

module.exports = {
  extractTitleFromText, generateIdSummary, generateEnSummary,
};
