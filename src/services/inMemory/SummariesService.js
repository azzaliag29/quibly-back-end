const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SummariesService {
  constructor() {
    this._summaries = [];
  }

  // Summary di proses dulu baru di simpan

  createSummary({ title, originalContent, language }) {
    const id = nanoid(16);
    const savedAt = new Date().toISOString();
    const keywords = 1;
    const summary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const newSummary = {
      id, language, title, originalContent, summary, keywords, savedAt,
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
