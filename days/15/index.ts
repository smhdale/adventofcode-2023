import { answer } from '../../lib/answer'
import { sum } from '../../lib/math'

/**
 * Part 1
 */

function hash(input: string): number {
	let value = 0
	for (let i = 0; i < input.length; i++) {
		const ascii = input.charCodeAt(i)
		value += ascii
		value *= 17
		value %= 256
	}
	return value
}

await answer(1, (input) => {
	const inputs = input[0].split(',')
	const hashes = inputs.map(hash)
	return sum(hashes)
})

/**
 * Part 2
 */

type Lens = {
	label: string
	focalLength: number
}

type Instruction =
	| { box: number; action: 'add'; label: string; focalLength: number }
	| { box: number; action: 'remove'; label: string }

class Box {
	private indexes: Map<string, number>
	public readonly position: number
	public readonly lenses: Lens[]

	constructor(position: number) {
		this.indexes = new Map()
		this.position = position
		this.lenses = []
	}

	private indexOf(label: string) {
		return this.indexes.get(label) ?? -1
	}

	private rebuildIndexes() {
		this.indexes.clear()
		for (let i = 0; i < this.lenses.length; i++) {
			this.indexes.set(this.lenses[i].label, i)
		}
	}

	public addLens(label: string, focalLength: number) {
		const index = this.indexOf(label)
		if (index > -1) {
			// Swap lens
			this.lenses[index].focalLength = focalLength
		} else {
			// Insert lens
			const length = this.lenses.push({ label, focalLength })
			this.indexes.set(label, length - 1)
		}
	}

	public removeLens(label: string) {
		const index = this.indexOf(label)
		if (index > -1) {
			// Remove lens
			this.lenses.splice(index, 1)
			this.rebuildIndexes()
		}
	}

	public getFocalPower() {
		return this.lenses.reduce((acc, lens, index) => {
			const slot = index + 1
			return acc + this.position * slot * lens.focalLength
		}, 0)
	}
}

function parseInstruction(instruction: string): Instruction {
	const [, label, op, focalLength] = instruction.match(/(\w+)([=-])(\d*)/) ?? []
	const box = hash(label)

	switch (op) {
		case '=':
			return {
				box,
				action: 'add',
				label,
				focalLength: Number(focalLength),
			}
		case '-':
			return {
				box,
				action: 'remove',
				label,
			}
		default:
			throw new Error(`Invalid instruction: ${instruction}`)
	}
}

await answer(2, (input) => {
	const boxes = Array.from({ length: 256 }).map((_, i) => new Box(i + 1))
	const instructions = input[0].split(',').map(parseInstruction)

	for (const inst of instructions) {
		switch (inst.action) {
			case 'add':
				boxes[inst.box].addLens(inst.label, inst.focalLength)
				break
			case 'remove':
				boxes[inst.box].removeLens(inst.label)
				break
		}
	}

	return sum(boxes.map((box) => box.getFocalPower()))
})
