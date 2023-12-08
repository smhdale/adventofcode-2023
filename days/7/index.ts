import { answer } from '../../lib/answer'

/**
 * Part 1
 */

class Card {
	public readonly symbol: string

	constructor(symbol: string) {
		this.symbol = symbol
	}

	public get value(): number {
		switch (this.symbol) {
			case 'A': return 14
			case 'K': return 13
			case 'Q': return 12
			case 'J': return 11
			case 'T': return 10
			default: return Number(this.symbol)
		}
	}

	public compare(other: Card): number {
		return this.value - other.value
	}

	public toString() {
		return this.symbol
	}
}

enum HandType {
	HighCard = 1,
	OnePair = 2,
	TwoPair = 3,
	ThreeOfAKind = 4,
	FullHouse = 5,
	FourOfAKind = 6,
	FiveOfAKind = 7,
}

class Hand {
	private counts: number[]

	public readonly bid: number
	public readonly cards: Card[]

	constructor(input: string) {
		const [cards, bid] = input.split(' ')
		this.bid = Number(bid)

		this.cards = []
		const counts = new Map<string, number>()

		for (const symbol of cards.split('')) {
			this.cards.push(new Card(symbol))
			const count = counts.get(symbol) ?? 0
			counts.set(symbol, count + 1)
		}

		this.counts = Array.from(counts.values()).sort((a, b) => b - a)
	}

	public get type(): HandType {
		const [a, b] = this.counts
		if (a === 5) return HandType.FiveOfAKind
		if (a === 4) return HandType.FourOfAKind
		if (a === 3) {
			if (b === 2) return HandType.FullHouse
			return HandType.ThreeOfAKind
		}
		if (a === 2) {
			if (b === 2) return HandType.TwoPair
			return HandType.OnePair
		}
		return HandType.HighCard
	}

	public compare(other: Hand): number {
		// Compare first on type
		const deltaType = this.type - other.type
		if (deltaType !== 0) return deltaType

		// Compare second on card
		for (let i = 0; i < this.cards.length; i++) {
			const deltaCard = this.cards[i].compare(other.cards[i])
			if (deltaCard !== 0) return deltaCard
		}

		// Hands are exactly quivalent
		return 0
	}

	public toString() {
		const cards = this.cards.map((card) => card.toString()).join('')
		return `${cards} (${this.type})`
	}
}

function calculateWinnings(hands: Hand[]): number {
	return hands.reduce((acc, hand, index) => {
		return acc + hand.bid * (index + 1)
	}, 0)
}

await answer(1, (input, meta) => {
	const hands = input.map((hand) => new Hand(hand))
	hands.sort((a, b) => a.compare(b))
	return calculateWinnings(hands)
})

/**
 * Part 2
 */

await answer(2, (input) => {

})
