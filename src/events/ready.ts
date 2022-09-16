import { otherOptions } from '../interfaces'

export const name = 'ready'
export const once = true

export function execute({ client }: otherOptions): void {
	console.log(`Ready! Logged in as ${client.user?.tag}`)
}