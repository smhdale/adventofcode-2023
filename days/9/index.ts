import { answer } from '../../lib/answer'
import { asNumericList } from '../../lib/input'
import { sum } from '../../lib/math'

/**
 * Part 1
 */

function getLastItem<T>(arr: T[]): T {
	return arr[arr.length - 1]
}

function getDifferences(sequence: number[]): number[] {
	const differences = []
	for (let i = 0; i < sequence.length - 1; i++) {
		differences.push(sequence[i + 1] - sequence[i])
	}
	return differences
}

function stackDifferences(sequence: number[]): number[][] {
	const stack = [sequence.slice()]
	let differences = getDifferences(sequence)

	while (differences.some((diff) => diff !== 0)) {
		stack.push(differences.slice())
		differences = getDifferences(differences)
	}

	return stack
}

function extrapolate(sequence: number[]): number {
	const diffStack = stackDifferences(sequence)
	const deepest = diffStack.length - 1

	for (let i = deepest; i >= 0; i--) {
		const stack = diffStack[i]
		const lastNumber = getLastItem(stack)
		if (i === deepest) {
			stack.push(lastNumber)
		} else {
			const subStack = diffStack[i + 1]
			stack.push(lastNumber + getLastItem(subStack))
		}
	}

	return getLastItem(diffStack[0])
}

await answer(1, (input, meta) => {
	const sequences = input.map(asNumericList)
	const extrapolations = sequences.map(extrapolate)
	return sum(extrapolations)
})

/**
 * Part 2
 */

await answer(2, (input) => {})
