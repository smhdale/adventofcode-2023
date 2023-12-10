import { answer } from '../../lib/answer'
import { asNumericList } from '../../lib/input'

/**
 * Part 1
 */

type Scratchcard = {
	id: number
	winningNumbers: number[]
	cardNumbers: Set<number>
}

function parseCard(input: string): Scratchcard {
	const [header, numbers] = input.split(': ')
	const id = Number(header.replace('Card ', ''))
	const [winningNumbers, cardNumbers] = numbers.split('|').map(asNumericList)
	return { id, winningNumbers, cardNumbers: new Set(cardNumbers) }
}

await answer(1, (input) => {
	const cards = input.map(parseCard)

	let score = 0
	for (const card of cards) {
		// Count card numbers that appear in winning numbers
		const matches = card.winningNumbers.filter((n) => card.cardNumbers.has(n))
		if (matches.length > 0) {
			score += 2 ** (matches.length - 1)
		}
	}

	return score
})

/**
 * Part 2
 */

type CountedCard = {
	id: number
	matches: number
}

function parseCountedCard(input: string): CountedCard {
	const [header, numbers] = input.split(': ')
	const id = Number(header.replace('Card ', ''))
	const [winningNumbers, cardNumbers] = numbers.split('|').map(asNumericList)

	const set = new Set(cardNumbers)
	let matches = 0

	for (const n of winningNumbers) {
		if (set.has(n)) matches++
	}

	return { id, matches }
}

await answer(2, (input) => {
	const cards = input.map(parseCountedCard)

	// Process all cards backwards and store list of card IDs to be added
	const winningsMap = new Map<number, number[]>()
	for (let i = cards.length - 1; i >= 0; i--) {
		const card = cards[i]
		const newCardIds = cards
			.slice(i + 1, i + 1 + card.matches)
			.map(({ id }) => id)
		winningsMap.set(card.id, newCardIds)
	}

	// Process card pool
	const pool: number[] = cards.map((card) => card.id)
	let processed = 0

	while (pool.length > 0) {
		const cardId = pool.shift()
		if (cardId) {
			const newCards = winningsMap.get(cardId) ?? []
			pool.push(...newCards)
			processed++
		}
	}

	// Return total number of processed cards
	return processed
})
