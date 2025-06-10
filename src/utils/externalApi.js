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

module.exports = { generateKeywords };
