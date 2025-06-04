const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor(db) {
    this._db = db;
  }

  async addRefreshToken(token) {
    await this._db.collection('authentications').insertOne({ token });
  }

  async verifyRefreshToken(token) {
    const result = await this._db.collection('authentications').findOne({ token });

    if (!result) {
      throw new InvariantError('Refresh token is not valid.');
    }
  }

  async deleteRefreshToken(token) {
    await this._db.collection('authentications').deleteOne({ token });
  }
}

module.exports = AuthenticationsService;
