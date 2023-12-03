import { resolve } from 'path'

async function readLines(path: string) {
	const file = Bun.file(path)
	const text = await file.text()
	return text.trim().split('\n')
}

export async function getSample(): Promise<string[]> {
	const day = Bun.env.DAY
	const part = Bun.env.PART

	// Check for part-specific sample input first
	if (part) {
		const path = resolve(import.meta.dir, `../days/${day}/sample${part}.txt`)
		if (await Bun.file(path).exists()) return await readLines(path)
	}

	// Fall back to default sample input
	const path = resolve(import.meta.dir, `../days/${day}/sample.txt`)
	return await readLines(path)
}

export async function getInput(): Promise<string[]> {
	const day = Bun.env.DAY
	const path = resolve(import.meta.dir, `../days/${day}/input.txt`)
	return await readLines(path)
}
