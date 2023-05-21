const { MongoClient } = require('mongodb');

class MongoSingleton {
  #mongoClient;

  static getClient() {
    if (this.mongoClient !== undefined) return this.mongoClient;

    // Initialize the connection.
    this.mongoClient = new MongoClient(process.env.MONGODB_URI);
    return this.mongoClient;
  }
}

module.exports = MongoSingleton;
