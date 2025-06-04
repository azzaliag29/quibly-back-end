const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor(db, ObjectID) {
    this._db = db;
    this._ObjectID = ObjectID;
  }

  async addUser({ email, password, name }) {
    await this.verifyNewEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword, name };

    const result = await this._db.collection('users').insertOne(user);

    if (!result.insertedId) {
      throw new InvariantError('Failed to add user');
    }

    const id = result.insertedId.toString();

    return id;
  }

  async verifyNewEmail(email) {
    const result = await this._db.collection('users').findOne({ email });

    if (result) {
      throw new InvariantError('Failed to add user. Email have been used.');
    }
  }

  async getUserById(userId) {
    if (!this._ObjectID.isValid(userId)) {
      throw new InvariantError('Id is not valid.');
    }

    const query = { _id: new this._ObjectID(userId) };
    const options = {
      projection:
      {
        _id: 1,
        email: 1,
        name: 1,
      },
    };

    const result = await this._db.collection('users').findOne(query, options);

    if (!result) {
      throw new NotFoundError('User not found.');
    }

    const { _id, ...userData } = result;

    return {
      id: _id.toString(),
      ...userData,
    };
  }

  async verifyUserCredential(email, password) {
    const query = { email };
    const options = {
      projection:
      {
        _id: 1,
        password: 1,
      },
    };

    const result = await this._db.collection('users').findOne(query, options);

    if (!result) {
      throw new AuthenticationError('Invalid credentials.');
    }

    const { _id: id, password: hashedPassword } = result;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Invalid credentials.');
    }

    return id.toString();
  }
}

module.exports = UsersService;
