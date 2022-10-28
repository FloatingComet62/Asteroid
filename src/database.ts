import { MongoClient, ObjectId, Collection, Document } from 'mongodb'
import { User, Language } from './interfaces'

class Database {
    client: MongoClient
    levelCollection: Collection<Document>
    languageCollection: Collection<Document>
    private static instance: Database

    private constructor() {
        this.client = new MongoClient(process.env.KEY || '')
        this.levelCollection = this.client.db('userdata').collection('levels')
        this.languageCollection = this.client.db('languages').collection('languages')
        this.connect();
    }

    public static getDatabase(): Database {
        if (!Database.instance) {
            return new Database()
        }
        return Database.instance
    }

    async connect(): Promise<void> {
        await this.client.connect()
    }

    async close(): Promise<void> {
        await this.client.close()
    }

    async createUser(userId: string): Promise<ObjectId> {
        const _id = new ObjectId()
        await this.levelCollection.insertOne({
            _id,
            userId,
            xp: 0
        })

        return _id
    }

    async getUser(userId: string): Promise<User> {
        return await this.levelCollection.findOne({ userId }) as User
    }

    async addPoints(userId: string): Promise<void> {
        await this.levelCollection.findOneAndUpdate({ userId }, { $inc: { xp: 1 } })
    }

    async addLang(
        langName: string,
        channelId: string,
        roleId: string
    ): Promise<ObjectId> {
        const _id = new ObjectId()
        await this.languageCollection.insertOne({
            _id,
            langName,
            channelId,
            roleId
        })

        return _id
    }

    async getLang(langName: string): Promise<Language> {
        return await this.languageCollection.findOne({ langName }) as Language
    }

    async deleteLang(langName: string): Promise<void> {
        await this.languageCollection.deleteOne({ langName })
    }
}

export default Database