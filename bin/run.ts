import { resolve } from 'path'
const day = process.argv[2]

// Validate CLI arg
if (!day || Number.isNaN(day)) {
	console.log('Please specify a day to run; e.g. "bun run day 1"')
	process.exit()
}

// Validate day exists
const path = resolve(import.meta.dir, `../days/${day}/index.ts`)
const file = Bun.file(path)
if (!(await file.exists())) {
	console.log('Day', day, 'not found.')
	process.exit()
}

// Import and run day
Bun.env.DAY = day
await import(path)
