import { answer } from '../../lib/answer'

/**
 * Part 1
 */

type Scratchcard = {
	id: number
	winningNumbers: number[]
	cardNumbers: number[]
}

function parseNumbers(input: string): number[] {
	return input.trim().split(/ +/).map(Number)
}

function parseCard(input: string): Scratchcard {
	const [header, numbers] = input.split(': ')
	const id = Number(header.replace('Card ', ''))
	const [winningNumbers, cardNumbers] = numbers.split('|').map(parseNumbers)
	return { id, winningNumbers, cardNumbers }
}

await answer(1, (input) => {
	const cards = input.map(parseCard)

	let score = 0
	for (const card of cards) {
		// Count card numbers that appear in winning numbers
		const winningCardNumbers = card.winningNumbers.filter((number) => {
			return card.cardNumbers.includes(number)
		})
		if (winningCardNumbers.length > 0) {
			score += 2 ** (winningCardNumbers.length - 1)
		}
	}

	return score
})

/**
 * Part 2
 */

await answer(2, (input) => {
	const cards = input.map(parseCard)
	const pool: Scratchcard[] = cards.slice()
	const processed: Scratchcard[] = []

	while (pool.length > 0) {
		const card = pool.shift()
		if (card) {
			// Win cards and add to pool
			const matches = card.winningNumbers
				.filter((number) => card.cardNumbers.includes(number))
				.length
			pool.push(...cards.slice(card.id, card.id + matches))

			// Move processed card to final array
			processed.push(card)
		}
	}

	// Return total number of processed cards
	return processed.length
})
