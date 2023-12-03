import { answer } from '../../lib/answer'
import { sum } from '../../lib/math'

/**
 * Part 1
 */

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

await answer(1, (input) => {
	const values = getCalibrationValues(input)
	return sum(values)
})

/**
 * Part 2
 */

const WORD_MAP = [
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

function identifyDigitAt(input: string, at: number): string | undefined {
	const char = input.charAt(at)

	// Check for numeric digit
	if (/\d/.test(char)) {
		return char
	}

	// Check for written digit
	for (const [word, num] of WORD_MAP) {
		if (input.substring(at, at + word.length) === word) {
			return num
		}
	}

	return undefined
}

function firstDigit(input: string) {
	for (let i = 0; i < input.length; i++) {
		const digit = identifyDigitAt(input, i)
		if (digit) return digit
	}
	throw new Error('No digit found.')
}

function lastDigit(input: string) {
	for (let i = input.length - 1; i >= 0; i--) {
		const digit = identifyDigitAt(input, i)
		if (digit) return digit
	}
	throw new Error('No digit found.')
}

function getCalibrationValues2(input: string[]) {
	return input.map((line) => {
		const first = firstDigit(line)
		const last = lastDigit(line)
		return Number(`${first}${last}`)
	})
}

await answer(2, (input) => {
	const values = getCalibrationValues2(input)
	return sum(values)
})
