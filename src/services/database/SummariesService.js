const pdf = require('pdf-parse');
const {
  extractTitleFromText, generateIdSummary, generateEnSummary, generateKeywords,
} = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SummariesService {
  constructor(db, ObjectID) {
    this._db = db;
    this._ObjectID = ObjectID;
  }

  async createSummary({ language, originalContent }) {
    const savedAt = new Date().toISOString();

    let parsedText;
    let title;
    let summary;

    if (originalContent instanceof Buffer) {
      const { text, info } = await pdf(originalContent);
      parsedText = text;
      title = info?.Title || extractTitleFromText(text);
    } else {
      parsedText = originalContent;
      title = extractTitleFromText(originalContent);
    }

    if (language === 'id') {
      summary = generateIdSummary(parsedText);
    } else {
      summary = generateEnSummary(parsedText);
    }

    const keywords = generateKeywords(parsedText);

    const newSummary = {
      language, title, originalContent: parsedText, summary, keywords, savedAt,
    };

    const result = await this._db.collection('summaries').insertOne(newSummary);

    if (!result.insertedId) {
      throw new InvariantError('Failed to create summary');
    }

    const id = result.insertedId.toString();

    return {
      id,
      summary,
      keywords,
    };
  }

  async getSummaries() {
    const result = await this._db.collection('summaries').find({}).sort({ savedAt: -1 }).toArray();

    return result.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
  }

  async getSummaryById(id) {
    if (!this._ObjectID.isValid(id)) {
      throw new InvariantError('Id is not valid.');
    }

    const result = await this._db.collection('summaries').findOne({ _id: new this._ObjectID(id) });

    if (!result) {
      throw new NotFoundError('Summary not found');
    }

    const { _id, ...rest } = result;

    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async editSummaryById(id, { title, summary }) {
    if (!this._ObjectID.isValid(id)) {
      throw new InvariantError('Id is not valid.');
    }

    const savedAt = new Date().toISOString();

    const result = await this._db.collection('summaries').updateOne({ _id: new this._ObjectID(id) }, { $set: { title, summary, savedAt } });

    if (result.modifiedCount === 0) {
      throw new NotFoundError('Failed to edit summary. Id is not found.');
    }
  }

  async deleteSummaryById(id) {
    if (!this._ObjectID.isValid(id)) {
      throw new InvariantError('Id is not valid.');
    }

    const result = await this._db.collection('summaries').deleteOne({ _id: new this._ObjectID(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundError('Failed to delete summary. Id is not found.');
    }
  }
}

module.exports = SummariesService;
