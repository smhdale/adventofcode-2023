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

await answer(2, (input) => {

})
