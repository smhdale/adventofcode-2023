import { answer } from '../../lib/answer'
import { eachPair } from '../../lib/combinations'

/**
 * Part 1
 */

let id = 1

class Galaxy {
	public id: number
	public x: number
	public y: number

	constructor(x: number, y: number) {
		this.id = id++
		this.x = x
		this.y = y
	}

	public drift(dx: number, dy: number) {
		this.x += dx
		this.y += dy
	}

	public distanceTo(other: Galaxy) {
		return Math.abs(other.x - this.x) + Math.abs(other.y - this.y)
		// return Math.max(0, Math.abs(other.x - this.x) - 1) + Math.max(0, Math.abs(other.y - this.y) - 1)
	}
}

class Universe {
	public width: number
	public height: number
	public galaxies: Galaxy[]

	constructor(input: string[]) {
		this.width = 0
		this.height = 0
		this.galaxies = []

		for (let y = 0; y < input.length; y++) {
			const row = input[y]
			for (let x = 0; x < row.length; x++) {
				const char = row[x]
				switch (char) {
					case '#':
						this.trackGalaxy(x, y)
						break
					default:
						break
				}
			}
		}
	}

	private trackGalaxy(x: number, y: number): void {
		const galaxy = new Galaxy(x, y)
		this.galaxies.push(galaxy)
		this.fitGalaxy(galaxy)
	}

	private fitGalaxy(galaxy: Galaxy): void {
		// Track universe size
		this.width = Math.max(this.width, galaxy.x)
		this.height = Math.max(this.height, galaxy.y)
	}

	public expand(drift: number): void {
		// Horizontally
		for (let x = this.width; x >= 0; x--) {
			if (this.galaxies.every((g) => g.x !== x)) {
				const galaxiesToDrift = this.galaxies.filter((g) => g.x > x)
				for (const galaxy of galaxiesToDrift) {
					galaxy.drift(drift, 0)
					this.fitGalaxy(galaxy)
				}
			}
		}

		// Vertically
		for (let y = this.height; y >= 0; y--) {
			if (this.galaxies.every((g) => g.y !== y)) {
				const galaxiesToDrift = this.galaxies.filter((g) => g.y > y)
				for (const galaxy of galaxiesToDrift) {
					galaxy.drift(0, drift)
					this.fitGalaxy(galaxy)
				}
			}
		}
	}
}

await answer(1, (input, meta) => {
	const universe = new Universe(input)
	universe.expand(1)

	let totalDistance = 0
	eachPair(universe.galaxies, (a, b) => {
		totalDistance += a.distanceTo(b)
	})
	return totalDistance
})

/**
 * Part 2
 */

await answer(2, (input) => {
	const universe = new Universe(input)
	universe.expand(999999)

	let totalDistance = 0
	eachPair(universe.galaxies, (a, b) => {
		totalDistance += a.distanceTo(b)
	})
	return totalDistance
})
