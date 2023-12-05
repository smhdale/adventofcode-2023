import { answer } from '../../lib/answer'
import { groupInput } from '../../lib/input'

/**
 * Part 1
 */

const PATHS = [
	'seed-to-soil',
	'soil-to-fertilizer',
	'fertilizer-to-water',
	'water-to-light',
	'light-to-temperature',
	'temperature-to-humidity',
	'humidity-to-location',
] as const

type Path = (typeof PATHS)[number]

class Range {
	public readonly sourceStart: number
	public readonly destStart: number
	public readonly length: number

	constructor(data: string) {
		const [destStart, sourceStart, length] = data.split(' ').map(Number)
		this.sourceStart = sourceStart
		this.destStart = destStart
		this.length = length
	}

	public contains(sourceValue: number): boolean {
		const delta = sourceValue - this.sourceStart
		return delta >= 0 && delta < this.length
	}

	public trace(sourceValue: number): number {
		const delta = sourceValue - this.sourceStart
		return this.destStart + delta
	}
}

class Almanac {
	private maps: Map<string, Range[]>

	constructor(data: string[][]) {
		this.maps = new Map()

		// Create all ranges
		for (const map of data) {
			const [header, ...rangeData] = map
			const name = header.replace(' map:', '')
			const ranges = rangeData.map((data) => new Range(data))
			this.maps.set(name, ranges)
		}
	}

	public trace(path: Path, sourceValue: number): number {
		const map = this.maps.get(path)
		if (!map) throw new Error(`Invalid path: ${path}`)

		const range = map.find((range) => range.contains(sourceValue))
		if (range) return range.trace(sourceValue)

		return sourceValue
	}

	public getLocationForSeed(seed: number) {
		let cursor = seed
		for (const path of PATHS) {
			cursor = this.trace(path, cursor)
		}
		return cursor
	}
}

await answer(1, (input) => {
	const [[seedData], ...almanacData] = groupInput(input)
	const [, ...seeds] = seedData.split(' ').map(Number)
	const almanac = new Almanac(almanacData)

	let lowestLocation = Infinity

	for (const seed of seeds) {
		const location = almanac.getLocationForSeed(seed)
		lowestLocation = Math.min(lowestLocation, location)
	}

	return lowestLocation
})

/**
 * Part 2
 */

await answer(2, (input) => {
	const [[seedData], ...almanacData] = groupInput(input)
	const [, ...seedRanges] = seedData.split(' ').map(Number)
	const almanac = new Almanac(almanacData)

	let lowestLocation = Infinity

	for (let i = 0; i < seedRanges.length; i += 2) {
		const start = seedRanges[i]
		const length = seedRanges[i + 1]
		for (let seed = start; seed < start + length; seed++) {
			const location = almanac.getLocationForSeed(seed)
			lowestLocation = Math.min(lowestLocation, location)
		}
	}

	return lowestLocation
})
