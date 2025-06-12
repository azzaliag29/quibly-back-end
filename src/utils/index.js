function extractTitleFromText(text) {
  const sentences = text.trim().split(/(?<=[.?!])\s+/);
  return sentences.slice(0, 1).join(' ').slice(0, 100) || 'Untitled';
}

module.exports = extractTitleFromText;
