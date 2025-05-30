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

function generateKeywords(text) {
  const words = text.toLowerCase().split(/\W+/);
  const keywords = [];

  words.forEach((word) => {
    if (word.length > 3 && !keywords.includes(word)) {
      keywords.push(word);
    }
  });

  return keywords.slice(0, 5);
  // Nanti diganti fetch buat ngambil dari model ML
}

module.exports = {
  extractTitleFromText, generateIdSummary, generateEnSummary, generateKeywords,
};
