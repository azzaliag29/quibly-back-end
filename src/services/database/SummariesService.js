/* eslint-disable linebreak-style */
const pdf = require('pdf-parse');
const { extractTitleFromText, generateSummary, generateKeywords } = require('../../utils/utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SummariesService {
  constructor(db, ObjectID) {
    this._db = db;
    this._ObjectID = ObjectID;
  }

  // Summary di proses dulu baru di simpan
  async createSummary({ language, originalContent }) {
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
      language, title, originalContent: parsedText, summary, keywords, savedAt,
    };

    const result = await this._db.collection('summaries').insertOne(newSummary);

    if (!result.acknowledged) {
      throw new InvariantError('Failed to create summary');
    }

    const id = result.insertedId;

    return {
      id,
      summary,
      keywords,
    };
  }

  async getSummaries() {
    const result = await this._db.collection('summaries').find({}).toArray();
    return result;
  }

  async getSummaryById(id) {
    const result = await this._db.collection('summaries').findOne({ _id: new this._ObjectID(id) });
    if (!result) {
      throw new NotFoundError('Summary not found');
    }
    return result;
  }

  async editSummaryById(id, { title, summary }) {
    const findSummary = await this._db.collection('summaries').findOne({ _id: new this._ObjectID(id) });

    if (!findSummary) {
      throw new InvariantError('Failed to update summary. ID not found.');
    }

    const savedAt = new Date().toISOString();

    await this._db.collection('summaries').updateOne({ _id: new this._ObjectID(id) }, { $set: { title, summary, savedAt } });
  }

  async deleteSummaryById(id) {
    const findSummary = await this._db.collection('summaries').findOne({ _id: new this._ObjectID(id) });

    if (!findSummary) {
      throw new InvariantError('Failed to delete summary. ID not found.');
    }

    await this._db.collection('summaries').deleteOne({ _id: new this._ObjectID(id) });
  }
}

module.exports = SummariesService;
