const { nanoid } = require('nanoid');
const pdf = require('pdf-parse');
const { extractTitleFromText, generateSummary, generateKeywords } = require('../../utils/utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SummariesService {
  constructor() {
    this._summaries = [];
  }

  // Summary di proses dulu baru di simpan

  async createSummary({ language, originalContent }) {
    const id = nanoid(16);
    const savedAt = new Date().toISOString();

    let parsedText;
    let title;

    if (originalContent instanceof Buffer) {
      const { text, info } = await pdf(originalContent);
      parsedText = text;
      title = info?.Title || extractTitleFromText(text);
    } else {
      parsedText = originalContent;
      title = extractTitleFromText(originalContent);
    }

    const summary = generateSummary(parsedText);
    const keywords = generateKeywords(parsedText);

    const newSummary = {
      id, language, title, originalContent: parsedText, summary, keywords, savedAt,
    };

    this._summaries.push(newSummary);

    const isSuccess = this._summaries.filter((s) => s.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Ringkasan gagal dibuat');
    }
    return {
      id,
      summary,
      keywords,
    };
  }

  getSummaries() {
    return this._summaries;
  }

  getSummaryById(id) {
    const summary = this._summaries.filter((s) => s.id === id)[0];
    if (!summary) {
      throw new NotFoundError('Ringkasan tidak ditemukan');
    }
    return summary;
  }

  editSummaryById(id, { title, summary }) {
    const index = this._summaries.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui ringkasan. Id tidak ditemukan');
    }

    const savedAt = new Date().toISOString();

    this._summaries[index] = {
      ...this._summaries[index],
      title,
      summary,
      savedAt,
    };
  }

  deleteSummaryById(id) {
    const index = this._summaries.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new NotFoundError('Ringkasan gagal dihapus. Id tidak ditemukan');
    }

    this._summaries.splice(index, 1);
  }
}

module.exports = SummariesService;
