const pdf = require('pdf-parse');
const extractTitleFromText = require('../../utils');
const { generateKeywords, generateSummary } = require('../../utils/externalApi');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class SummariesService {
  constructor(db, ObjectID) {
    this._db = db;
    this._ObjectID = ObjectID;
  }

  async createSummary({ language, originalContent, owner }) {
    if (!owner) {
      throw new InvariantError('User credential is required.');
    }

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

    const summary = await generateSummary(parsedText);

    const keywordsResponse = await generateKeywords({ text: summary });
    const { keywords } = keywordsResponse;

    const newSummary = {
      language, title, originalContent: parsedText, summary, keywords, savedAt, owner,
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

  async getSummaries(owner) {
    if (!owner) {
      throw new InvariantError('User credential is required.');
    }

    const result = await this._db.collection('summaries').find({ owner }).sort({ savedAt: -1 }).toArray();

    return result.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
  }

  async getSummaryById(id) {
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
    const savedAt = new Date().toISOString();

    const result = await this._db.collection('summaries').updateOne({ _id: new this._ObjectID(id) }, { $set: { title, summary, savedAt } });

    if (result.modifiedCount === 0) {
      throw new NotFoundError('Failed to edit summary. Id is not found.');
    }
  }

  async deleteSummaryById(id) {
    const result = await this._db.collection('summaries').deleteOne({ _id: new this._ObjectID(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundError('Failed to delete summary. Id is not found.');
    }
  }

  async verifySummaryOwner(id, owner) {
    if (!owner) {
      throw new InvariantError('User credential is required.');
    }

    const result = await this._db.collection('summaries').findOne({ _id: new this._ObjectID(id) });

    if (!result) {
      throw new NotFoundError('Summary not found');
    }

    if (result.owner !== owner) {
      throw new AuthorizationError('You are not authorized to access this resource.');
    }
  }
}

module.exports = SummariesService;
