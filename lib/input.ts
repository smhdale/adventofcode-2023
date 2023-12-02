import { resolve } from 'path'

async function readLines(path: string) {
	const file = Bun.file(path)
	const text = await file.text()
	return text.trim().split('\n')
}

export async function getSample(): Promise<string[]> {
	const day = Bun.env.DAY
	const path = resolve(import.meta.dir, `../days/${day}/sample.txt`)
	return await readLines(path)
}

export async function getInput(): Promise<string[]> {
	const day = Bun.env.DAY
	const path = resolve(import.meta.dir, `../days/${day}/input.txt`)
	return await readLines(path)
}
