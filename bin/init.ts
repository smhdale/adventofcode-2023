import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'path'
const day = process.argv[2]

// Validate CLI arg
if (!day || Number.isNaN(day)) {
	console.log('Please specify a day to init; e.g. "bun run init 1"')
	process.exit()
}

// Check if day dir exists
const path = resolve(import.meta.dir, `../days/${day}`)
if (existsSync(path)) {
	console.log('Folder for day', day, 'already exists')
	process.exit()
}

// Create day dir
mkdirSync(path)

// Create files
const indexFilePath = resolve(path, 'index.ts')
const indexFileContent = `import { answer } from '../../lib/answer'

/**
 * Part 1
 */

answer(1, (input) => {

})

/**
 * Part 2
 */

answer(2, (input) => {

})
`

// Input and sample input
const inputFilePath = resolve(path, 'input.txt')
const sampleFilePath = resolve(path, 'sample.txt')

// Write all files
await Promise.all([
	Bun.write(indexFilePath, indexFileContent),
	Bun.write(inputFilePath, ''),
	Bun.write(sampleFilePath, ''),
])

console.log('Bootstrapped files for day', day)
