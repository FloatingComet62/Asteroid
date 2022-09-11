import { MongoClient, ObjectId } from 'mongodb'
import { User } from './interfaces'

class Database {
  client: MongoClient

  constructor() {
    this.client = new MongoClient(process.env.KEY || '')
  }

  async connect() {
    await this.client.connect()
  }

  async close() {
    await this.client.close()
  }

  async createUser(userId: string) {
    const usersCollection = this.client.db('levels').collection('users')
    const _id = new ObjectId()
    await usersCollection.insertOne({
      _id,
      userId,
      c: 0,
      cpp: 0,
      "c-sharp": 0,
      rust: 0,
      java: 0,
      python: 0,
      typescript: 0,
      javascript: 0,
      general: 0
    })

    return _id
  }

  async getUser(userId: string) {
    const usersCollection = this.client.db('levels').collection('users')
    const userDoc = await usersCollection.findOne({ userId }) as User
    return userDoc
  }
}

export default Database