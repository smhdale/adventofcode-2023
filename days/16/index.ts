import { answer } from '../../lib/answer'

/**
 * Part 1
 */

interface ICoord {
	x: number
	y: number
}

class Coord implements ICoord {
	public x: number
	public y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	public clone(): Coord {
		return new Coord(this.x, this.y)
	}

	public copyFrom(other: ICoord): void {
		this.x = other.x
		this.y = other.y
	}

	public equals(other: ICoord): boolean {
		return this.x === other.x && this.y === other.y
	}

	public toString(): string {
		return `${this.x},${this.y}`
	}
}

class LightBeam extends Coord {
	public readonly trail: Set<string>
	public readonly delta: Coord
	public active: boolean

	constructor(x: number, y: number, delta: ICoord) {
		super(x, y)
		this.trail = new Set()
		this.delta = new Coord(delta.x, delta.y)
		this.active = true
	}

	public clone(): LightBeam {
		return new LightBeam(this.x, this.y, this.delta)
	}

	public tick() {
		this.x += this.delta.x
		this.y += this.delta.y
		this.trail.add(this.toString())
	}

	public redirect(delta: ICoord) {
		this.delta.copyFrom(delta)
	}

	public getMoment(): string {
		return `${this.toString()}->${this.delta.toString()}`
	}
}

class Mirror extends Coord {
	public readonly type: string

	constructor(x: number, y: number, type: string) {
		super(x, y)
		this.type = type
	}

	/**
	 * Redirects an incoming light beam, and creates new beams if required.
	 */
	public actOn(beam: LightBeam): LightBeam[] {
		// Beam moving right
		if (beam.delta.equals({ x: 1, y: 0 })) {
			switch (this.type) {
				case '/':
					beam.redirect({ x: 0, y: -1 })
					return []
				case '\\':
					beam.redirect({ x: 0, y: 1 })
					return []
				case '|': {
					const clone = beam.clone()
					beam.redirect({ x: 0, y: 1 })
					clone.redirect({ x: 0, y: -1 })
					return [clone]
				}
			}
		}

		// Beam moving left
		if (beam.delta.equals({ x: -1, y: 0 })) {
			switch (this.type) {
				case '/':
					beam.redirect({ x: 0, y: 1 })
					return []
				case '\\':
					beam.redirect({ x: 0, y: -1 })
					return []
				case '|': {
					const clone = beam.clone()
					beam.redirect({ x: 0, y: -1 })
					clone.redirect({ x: 0, y: 1 })
					return [clone]
				}
			}
		}

		// Beam moving down
		if (beam.delta.equals({ x: 0, y: 1 })) {
			switch (this.type) {
				case '/':
					beam.redirect({ x: -1, y: 0 })
					return []
				case '\\':
					beam.redirect({ x: 1, y: 0 })
					return []
				case '-': {
					const clone = beam.clone()
					beam.redirect({ x: -1, y: 0 })
					clone.redirect({ x: 1, y: 0 })
					return [clone]
				}
			}
		}

		// Beam moving up
		if (beam.delta.equals({ x: 0, y: -1 })) {
			switch (this.type) {
				case '/':
					beam.redirect({ x: 1, y: 0 })
					return []
				case '\\':
					beam.redirect({ x: -1, y: 0 })
					return []
				case '-': {
					const clone = beam.clone()
					beam.redirect({ x: 1, y: 0 })
					clone.redirect({ x: -1, y: 0 })
					return [clone]
				}
			}
		}

		return []
	}
}

class MirrorMatrix {
	public readonly width: number
	public readonly height: number
	private mirrors: Map<string, Mirror>

	constructor(schematic: string[]) {
		this.width = schematic[0].length
		this.height = schematic.length
		this.mirrors = new Map()

		for (let y = 0; y < this.height; y++) {
			const row = schematic[y]
			for (let x = 0; x < this.width; x++) {
				const char = row.charAt(x)
				if (char !== '.') {
					const mirror = new Mirror(x, y, char)
					this.mirrors.set(mirror.toString(), mirror)
				}
			}
		}
	}

	public outOfBounds(coord: ICoord): boolean {
		return (
			coord.x < 0 ||
			coord.x >= this.width ||
			coord.y < 0 ||
			coord.y >= this.height
		)
	}

	public getMirrorAt(coord: Coord): Mirror | undefined {
		return this.mirrors.get(coord.toString())
	}
}

function printMatrix(matrix: MirrorMatrix, beams: LightBeam[]): void {
	const rows = []

	for (let y = 0; y < matrix.height; y++) {
		let row = ''
		for (let x = 0; x < matrix.width; x++) {
			const coord = new Coord(x, y)

			// Draw light path
			// if (beams.some((beam) => beam.trail.has(coord.toString()))) {
			if (beams.some((beam) => beam.equals(coord) && beam.active)) {
				row += '#'
				continue
			}

			const mirror = matrix.getMirrorAt(coord)
			if (mirror) {
				row += mirror.type
				continue
			}

			row += '.'
		}

		rows.push(row)
	}

	console.log(rows.join('\n'))
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

await answer(1, async (input, meta) => {
	const matrix = new MirrorMatrix(input)
	const beams: LightBeam[] = [new LightBeam(-1, 0, { x: 1, y: 0 })]

	// Count all energised tiles
	const energised = new Set()
	const moments = new Set()

	// Debug
	const printStep = async () => {
		if (meta.mode === 'sample') {
			console.clear()
			printMatrix(matrix, beams)
			await sleep(33)
		}
	}
	await printStep()

	// Run all beams until all inactive
	while (beams.some((beam) => beam.active)) {
		const newBeams = []

		for (const beam of beams) {
			if (beam.active) {
				// Check if this path was already travelled
				const moment = beam.getMoment()
				if (moments.has(moment)) {
					beam.active = false
					continue
				}
				moments.add(moment)

				// Move beam
				beam.tick()

				// Check if beam became inactive
				if (!beam.active) {
					continue
				}

				// Check if beam went out of bounds
				if (matrix.outOfBounds(beam)) {
					beam.active = false
					continue
				}

				// Count tile as energised
				energised.add(beam.toString())

				// Check for mirror
				const mirror = matrix.getMirrorAt(beam)
				if (mirror) {
					const splits = mirror.actOn(beam)
					newBeams.push(...splits)
				}
			}
		}

		// Add new beams
		beams.push(...newBeams)

		// Debug
		await printStep()
	}

	return energised.size
})

/**
 * Part 2
 */

await answer(2, (input) => {})
