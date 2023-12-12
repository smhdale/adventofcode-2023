import { answer } from '../../lib/answer'

/**
 * Part 1
 */

type Coord = { x: number; y: number }

function xyToId(x: number, y: number): string {
	return `${x},${y}`
}

interface IPipe {
	id: string
	x: number
	y: number
	traverse(from: string): string
}

interface IPlumbing {
	start: Coord
	pipes: Pipes
}

type Pipes = Map<string, IPipe>
type Traversal = {
	pipes: IPipe[]
	isLoop: boolean
}

function getConnectionDeltas(symbol: string): [Coord, Coord] {
	switch (symbol) {
		case '|':
			return [
				{ x: 0, y: -1 },
				{ x: 0, y: 1 },
			]
		case '-':
			return [
				{ x: -1, y: 0 },
				{ x: 1, y: 0 },
			]
		case 'L':
			return [
				{ x: 0, y: -1 },
				{ x: 1, y: 0 },
			]
		case 'J':
			return [
				{ x: -1, y: 0 },
				{ x: 0, y: -1 },
			]
		case '7':
			return [
				{ x: 0, y: 1 },
				{ y: 0, x: -1 },
			]
		case 'F':
			return [
				{ x: 1, y: 0 },
				{ x: 0, y: 1 },
			]
		default:
			throw new Error(`Unrecognised pipe: ${symbol}`)
	}
}

function createPipe(x: number, y: number, symbol: string): IPipe {
	const id = xyToId(x, y)
	const deltas = getConnectionDeltas(symbol)
	const [a, b] = deltas.map((delta) => xyToId(x + delta.x, y + delta.y))

	const connections = new Map<string, string>()
	connections.set(a, b)
	connections.set(b, a)

	function traverse(from: string) {
		const to = connections.get(from)
		if (!to) {
			throw new Error(
				`Pipe ${symbol} at ${id} cannot be traversed from ${from}`,
			)
		}
		return to
	}

	return { id, x, y, traverse }
}

function parsePlumbing(input: string[]): IPlumbing {
	const pipes = new Map<string, IPipe>()
	let start: Coord | null = null

	for (let y = 0; y < input.length; y++) {
		const line = input[y]
		for (let x = 0; x < line.length; x++) {
			const symbol = line[x]
			switch (symbol) {
				case '.':
					// Do nothing
					break
				case 'S':
					start = { x, y }
					break
				default:
					pipes.set(xyToId(x, y), createPipe(x, y, symbol))
					break
			}
		}
	}

	if (!start) throw new Error('Start tile not found')
	return { start, pipes }
}

const START_DIRECTIONS: Coord[] = [
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 },
	{ x: 0, y: -1 },
]

function traversePipes(pipes: Pipes, start: Coord, delta: Coord): Traversal {
	const startPos = xyToId(start.x, start.y)
	const traversal: Traversal = {
		pipes: [],
		isLoop: false,
	}

	let pos = startPos
	let nextPos = xyToId(start.x + delta.x, start.y + delta.y)
	let pipe = pipes.get(nextPos)

	while (pipe) {
		// Find next pipe
		nextPos = pipe.traverse(pos)

		// Move into pipe
		pos = pipe.id
		traversal.pipes.push(pipe)

		// Update pipe
		pipe = pipes.get(nextPos)
	}

	if (nextPos === startPos) {
		traversal.isLoop = true
	}

	return traversal
}

await answer(1, (input) => {
	const { start, pipes } = parsePlumbing(input)

	let maxLoop = 0

	// Find longest loop from start position
	for (const delta of START_DIRECTIONS) {
		try {
			const traversal = traversePipes(pipes, start, delta)
			if (traversal.isLoop) {
				maxLoop = Math.max(maxLoop, traversal.pipes.length)
			}
		} catch {
			// Can't start moving in this direction; skip
		}
	}

	return Math.ceil(maxLoop / 2)
})

/**
 * Part 2
 */

/**
 * Naïve implementation of the shoelace formula
 * @see https://www.mathsisfun.com/geometry/area-irregular-polygons.html
 */
function calculateAreaInside(poly: Coord[]): number {
	const vertices = poly.length
	let area = 0

	for (let i = 0; i < vertices; i++) {
		const u = poly[i]
		const v = poly[(i + 1) % vertices]

		const w = v.x - u.x
		const h = (u.y + v.y) / 2

		area += w * h
	}

	return Math.abs(area)
}

await answer(2, (input) => {
	const { start, pipes } = parsePlumbing(input)

	let bestTraversal: Traversal | null = null

	// Find longest loop from start position
	for (const delta of START_DIRECTIONS) {
		try {
			const traversal = traversePipes(pipes, start, delta)
			if (!bestTraversal || (traversal.isLoop && traversal.pipes.length > bestTraversal.pipes.length)) {
				bestTraversal = traversal
			}
		} catch {
			// Can't start moving in this direction; skip
		}
	}

	// Run shoelace formula on best traversal
	if (!bestTraversal) throw new Error('Loop not found')

	const loopArea = calculateAreaInside([start, ...bestTraversal.pipes])
	return loopArea
})
