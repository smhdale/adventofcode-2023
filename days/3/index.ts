import { answer } from '../../lib/answer'

/**
 * Part 1
 */

class Point {
	public x: number
	public y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	public equals(other: Point) {
		return this.x === other.x && this.y === other.y
	}
}

class Rectangle {
	public topLeft: Point
	public bottomRight: Point

	constructor(x: number, y: number, w: number, h: number) {
		this.topLeft = new Point(x, y)
		this.bottomRight = new Point(x + w - 1, y + h - 1)
	}

	public get left(): number {
		return this.topLeft.x
	}
	public get top(): number {
		return this.topLeft.y
	}
	public get right(): number {
		return this.bottomRight.x
	}
	public get bottom(): number {
		return this.bottomRight.y
	}

	public contains(point: Point): boolean {
		return (
			point.x >= this.left &&
			point.x <= this.right &&
			point.y >= this.top &&
			point.y <= this.bottom
		)
	}

	public extend({ x, y }: Point): void {
		this.topLeft.x = Math.min(this.topLeft.x, x)
		this.topLeft.y = Math.min(this.topLeft.y, y)
		this.bottomRight.x = Math.max(this.bottomRight.x, x)
		this.bottomRight.y = Math.max(this.bottomRight.y, y)
	}

	public intersects(rectangle: Rectangle): boolean {
		if (this.right < rectangle.left || rectangle.right < this.left) {
			return false
		}
		if (this.bottom < rectangle.top || rectangle.bottom < this.top) {
			return false
		}
		return true
	}
}

class SchematicPart<T extends string | number> extends Rectangle {
	public readonly id: number
	public value: T

	constructor(
		id: number,
		x: number,
		y: number,
		w: number,
		h: number,
		value: T,
	) {
		super(x, y, w, h)
		this.id = id
		this.value = value
	}
}

interface ISchematic {
	symbolicParts: SchematicPart<string>[]
	numericParts: SchematicPart<number>[]
}

function parseSchematic(input: string[]): ISchematic {
	let id = 0
	const nextId = () => id++

	const symbolicParts: SchematicPart<string>[] = []
	const numericParts: SchematicPart<number>[] = []

	let currentNumericPart: {
		value: string
		part: SchematicPart<number>
	} | null = null

	// Parse input lines to items
	for (let y = 0; y < input.length; y++) {
		const line = input[y]
		for (let x = 0; x < line.length; x++) {
			const char = line.charAt(x)

			// Handle numeric parts
			if (/\d/.test(char)) {
				// Extend or create numeric part
				if (!currentNumericPart) {
					currentNumericPart = {
						value: '',
						part: new SchematicPart(nextId(), x, y, 1, 1, 0),
					}
				}
				const point = new Point(x, y)
				currentNumericPart.value += char
				currentNumericPart.part.extend(point)
				currentNumericPart.part.value = Number(currentNumericPart.value)
			} else {
				// Finish current numeric part
				if (currentNumericPart !== null) {
					numericParts.push(currentNumericPart.part)
					currentNumericPart = null
				}

				// Handle symbolic parts
				if (char !== '.') {
					symbolicParts.push(
						new SchematicPart(nextId(), x - 1, y - 1, 3, 3, char),
					)
				}
			}
		}

		// Finish numeric part on line end
		if (currentNumericPart !== null) {
			numericParts.push(currentNumericPart.part)
			currentNumericPart = null
		}
	}

	return { symbolicParts, numericParts }
}

await answer(1, (input) => {
	const { symbolicParts, numericParts } = parseSchematic(input)
	let partSum = 0

	for (const numericPart of numericParts) {
		for (const symbolicPart of symbolicParts) {
			if (numericPart.intersects(symbolicPart)) {
				partSum += numericPart.value
				break
			}
		}
	}

	return partSum
})

/**
 * Part 2
 */

await answer(2, (input) => {
	const { symbolicParts, numericParts } = parseSchematic(input)

	return symbolicParts.reduce((acc, symbolicPart) => {
		if (symbolicPart.value === '*') {
			// Identify gears with exactly two parts surrounding
			const surroundingNumericParts = numericParts.filter((numericPart) => {
				return symbolicPart.intersects(numericPart)
			})
			if (surroundingNumericParts.length === 2) {
				const [a, b] = surroundingNumericParts
				return acc + a.value * b.value
			}
		}
		return acc
	}, 0)
})
