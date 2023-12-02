import { answer } from "../../lib/answer"

function getFirstAndLastDigit(input: string) {
	const digits = input.replace(/[^\d]/g, '')
	const { [0]: first, length, [length - 1]: last } = digits
	return { first, last }
}

function getCalibrationValues(input: string[]) {
	return input.map((line) => {
		const { first, last } = getFirstAndLastDigit(line)
		return Number(`${first}${last}`)
	})
}

/**
 * Part 1
 */

await answer(1, (input) => {
	const values = getCalibrationValues(input)
	return values.reduce((acc, value) => acc + value, 0)
})

/**
 * Part 2
 */

function wordsToDigits(input: string): string {
	const wordMap = [
		['one', '1'],
		['two', '2'],
		['three', '3'],
		['four', '4'],
		['five', '5'],
		['six', '6'],
		['seven', '7'],
		['eight', '8'],
		['nine', '9'],
	]

	let output = input
	for (const [word, num] of wordMap) {
		while (output.includes(word)) {
			output = output.replace(word, num)
		}
	}

	return output
}

await answer(2, (input) => {
	const correctedInputs = input.map(wordsToDigits)
	const values = getCalibrationValues(correctedInputs)
	return values.reduce((acc, value) => acc + value, 0)
})
