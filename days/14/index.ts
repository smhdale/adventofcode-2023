import { answer } from '../../lib/answer'

/**
 * Part 1
 */

type Coord = {
	x: number
	y: number
}

type Tilt = { dx: -1 | 1 } | { dy: -1 | 1 }

function addTilt(coord: Coord, tilt: Tilt): Coord {
	const next = { ...coord }
	if ('dx' in tilt) next.x += tilt.dx
	else next.y += tilt.dy
	return next
}

class Platform {
	public width: number
	public height: number
	public rocks: {
		round: Coord[]
		square: Coord[]
	}

	constructor(input: string[]) {
		this.width = input[0].length
		this.height = input.length
		this.rocks = {
			round: [],
			square: [],
		}

		for (let y = 0; y < input.length; y++) {
			const row = input[y]
			for (let x = 0; x < row.length; x++) {
				const cell = row[x]
				switch (cell) {
					case 'O':
						this.rocks.round.push({ x, y })
						break
					case '#':
						this.rocks.square.push({ x, y })
						break
				}
			}
		}
	}

	private inBounds(coord: Coord): boolean {
		return (
			coord.x >= 0 &&
			coord.x < this.width &&
			coord.y >= 0 &&
			coord.y < this.height
		)
	}

	public getRockAt({ x, y }: Coord): Coord | null {
		for (const rock of [...this.rocks.square, ...this.rocks.round]) {
			if (rock.x === x && rock.y === y) {
				return rock
			}
		}
		return null
	}

	public slideRock(rock: Coord, tilt: Tilt): void {
		let coord: Coord = rock

		while (this.inBounds(coord)) {
			const nextCoord = addTilt(coord, tilt)
			if (this.getRockAt(nextCoord) || !this.inBounds(nextCoord)) break
			coord = nextCoord
		}

		rock.x = coord.x
		rock.y = coord.y
	}

	public tilt(tilt: Tilt): void {
		// Sort
		this.rocks.round.sort((a, b) => {
			if ('dx' in tilt) {
				const dx = b.x - a.x
				return tilt.dx > 0 ? dx : -dx
			}
			const dy = b.y - a.y
			return tilt.dy > 0 ? dy : -dy
		})

		// Slide
		for (const rock of this.rocks.round) {
			this.slideRock(rock, tilt)
		}
	}

	public spin(): void {
		const cycle: Tilt[] = [{ dy: -1 }, { dx: -1 }, { dy: 1 }, { dx: 1 }]
		for (const tilt of cycle) {
			this.tilt(tilt)
		}
	}

	public calculateNorthLoad(): number {
		let load = 0
		for (const rock of this.rocks.round) {
			load += this.height - rock.y
		}
		return load
	}

	public toString(): string {
		const rows = Array.from({ length: this.height }).map(() =>
			'.'.repeat(this.width).split(''),
		)
		for (const { x, y } of this.rocks.round) rows[y][x] = 'O'
		for (const { x, y } of this.rocks.square) rows[y][x] = '#'
		return rows.map((row) => row.join('')).join('\n')
	}
}

await answer(1, (input) => {
	const platform = new Platform(input)
	platform.tilt({ dy: -1 })
	return platform.calculateNorthLoad()
})

/**
 * Part 2
 */

await answer(2, (input) => {
	const cycles = 1_000_000_000
	const logInterval = 1_000_000

	const platform = new Platform(input)

	console.log('Spinning...')
	for (let i = 0; i < cycles; i++) {
		platform.spin()
		if (i % logInterval === 0) {
			console.log(`${((i / cycles) * 100).toFixed(2)}% complete`)
		}
	}
	return platform.calculateNorthLoad()
})
