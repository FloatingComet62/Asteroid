import { PrismaClient } from '@prisma/client'
import { User, Language } from './interfaces'

class Database {
    client: PrismaClient
    private static instance: Database

    private constructor() {
        this.client = new PrismaClient()
    }

    public static getDatabase(): Database {
        if (!Database.instance) Database.instance = new Database()
        return Database.instance
    }

    async createUser(userId: string): Promise<void> {
        await this.client.user.create({
            data: {
                xp: 0,
                userId,
                updated_at: new Date()
            }
        })
    }

    async getUser(userId: string): Promise<User> {
        return await this.client.user.findUnique({ where: { userId } }) as User
    }

    async addPoints(userId: string): Promise<void> {
        await this.client.user.update({
            where: { userId },
            data: {
                xp: { increment: 1 },
                updated_at: new Date()
            }
        })
    }

    async addLang(
        langName: string,
        channelId: string,
        roleId: string
    ): Promise<void> {
        await this.client.language.create({
            data: {
                name: langName,
                channelId,
                roleId,
                updated_at: new Date()
            }
        })
    }

    async getLang(langName: string): Promise<Language> {
        return await this.client.language.findUnique({ where: { name: langName } }) as Language
    }

    async deleteLang(langName: string): Promise<void> {
        await this.client.language.delete({ where: { name: langName } })
    }
}

export default Database