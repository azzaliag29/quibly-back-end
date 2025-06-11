async function generateKeywords({ text }) {
  const data = JSON.stringify({ text });

  const fetchResponse = await fetch('https://extract-keywords-production.up.railway.app/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

async function generateSummary(text) {
  const { Client } = await import ('@gradio/client');
  const app = await Client.connect('khoesan/summarizer-t5');

  const result = await app.predict('/predict', [text]);
  return result.data[0];
}

module.exports = { generateKeywords, generateSummary };
