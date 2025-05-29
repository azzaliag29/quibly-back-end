const InvariantError = require('../../exceptions/InvariantError');

class MessagesService {
  constructor(db) {
    this._db = db;
  }

  async addMessage({ name, email, message }) {
    const newMessage = {
      name, email, message,
    };

    const result = await this._db.collection('messages').insertOne(newMessage);

    if (!result.acknowledged) {
      throw new InvariantError('Failed to add message');
    }
  }
}

module.exports = MessagesService;
