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
	const lastCardId = cards[cards.length - 1].id

	// Maps to quickly look up match and winnings values for cards
	const matchesMap = cards.reduce((acc, card) => {
		acc.set(card.id, card.matches)
		return acc
	}, new Map<number, number>())
	const winningsMap = new Map<number, number>()

	// Recursive function to count winnings for a given card ID
	const countWinnings = (cardId: number) => {
		// End case
		if (cardId === lastCardId) return 1

		// Check if already counted
		if (winningsMap.has(cardId)) return winningsMap.get(cardId) ?? 1

		// Count and store
		const matches = matchesMap.get(cardId) ?? 0
		const nextIds = cards.slice(cardId, cardId + matches).map((card) => card.id)

		let winnings = 1
		for (const nextId of nextIds) {
			winnings += countWinnings(nextId)
		}
		winningsMap.set(cardId, winnings)
		return winnings
	}

	let totalWinnings = 0
	for (const card of cards) {
		totalWinnings += countWinnings(card.id)
	}

	return totalWinnings
})
