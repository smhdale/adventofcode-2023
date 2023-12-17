import { answer } from '../../lib/answer'
import { groupInput } from '../../lib/input'
import { sum } from '../../lib/math'

/**
 * Part 1
 */

type Mirror = {
	rows: number[]
	cols: number[]
}

type Reflection = { row: number } | { col: number }

function initArr(length: number): string[] {
	return Array.from({ length }).map(() => '')
}

function toBinary(input: string): number {
	return Number.parseInt(input.replace(/\./g, '0').replace(/#/g, '1'), 2)
}

function parseMirror(input: string[]): Mirror {
	const rows = initArr(input.length)
	const cols = initArr(input[0].length)

	for (let y = 0; y < input.length; y++) {
		const row = input[y]
		for (let x = 0; x < row.length; x++) {
			const cell = row[x]
			rows[y] += cell
			cols[x] += cell
		}
	}

	return {
		rows: rows.map(toBinary),
		cols: cols.map(toBinary),
	}
}

function reverse(input: number[]): number[] {
	const rev = []
	for (let i = input.length - 1; i >= 0; i--) {
		rev.push(input[i])
	}
	return rev
}

function findReflectionIndex(input: number[]): number {
	for (let i = 1; i < input.length; i++) {
		const left = reverse(input.slice(0, i))
		const right = input.slice(i)

		// Check this position for a reflection
		let isReflection = true
		const minLength = Math.min(left.length, right.length)
		for (let j = 0; j < minLength; j++) {
			if (left[j] !== right[j]) {
				isReflection = false
				break
			}
		}
		if (isReflection) {
			return i
		}
	}
	return -1
}

function findReflection(mirror: Mirror): Reflection {
	const row = findReflectionIndex(mirror.rows)
	if (row > -1) return { row }
	const col = findReflectionIndex(mirror.cols)
	return { col }
}

function summariseMirror(mirror: Mirror): number {
	const reflection = findReflection(mirror)
	if ('row' in reflection) return reflection.row * 100
	return reflection.col
}

await answer(1, (input) => {
	const mirrors = groupInput(input).map(parseMirror)
	return sum(mirrors.map(summariseMirror))
})

/**
 * Part 2
 */

await answer(2, (input) => {})
