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
			case 'A':
				return 14
			case 'K':
				return 13
			case 'Q':
				return 12
			case 'J':
				return 11
			case 'T':
				return 10
			default:
				return Number(this.symbol)
		}
	}

	public compare(other: Card): number {
		return this.value - other.value
	}

	public toString(): string {
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

type CardCount = {
	symbol: string
	count: number
}

type CreateCardFn = (symbol: string) => Card

class Hand {
	private counts: CardCount[]

	public readonly bid: number
	public readonly cards: Card[]

	constructor(
		input: string,
		createCard: CreateCardFn = (symbol) => new Card(symbol),
	) {
		const [cards, bid] = input.split(' ')
		this.bid = Number(bid)
		this.cards = cards.split('').map(createCard)
		this.counts = this.countCards()
	}

	protected countCards(): CardCount[] {
		const counts: Map<string, number> = new Map()
		for (const card of this.cards) {
			const count = counts.get(card.symbol) ?? 0
			counts.set(card.symbol, count + 1)
		}
		return Array.from(counts.entries())
			.map(([symbol, count]): CardCount => ({ symbol, count }))
			.sort((a, b) => b.count - a.count)
	}

	public get type(): HandType {
		const [a, b] = this.counts.map((count) => count.count)
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

	public toString(): string {
		const cards = this.cards.map((card) => card.toString()).join('')
		return `${cards} (${this.type})`
	}
}

function calculateWinnings(hands: Hand[]): number {
	return hands.reduce((acc, hand, index) => {
		return acc + hand.bid * (index + 1)
	}, 0)
}

await answer(1, (input) => {
	const hands = input.map((hand) => new Hand(hand))
	hands.sort((a, b) => a.compare(b))
	return calculateWinnings(hands)
})

/**
 * Part 2
 */

class CardOrJoker extends Card {
	public get value(): number {
		switch (this.symbol) {
			case 'J':
				return 1
			default:
				return super.value
		}
	}
}

class HandWithJokers extends Hand {
	constructor(input: string) {
		super(input, (symbol) => new CardOrJoker(symbol))
	}

	protected countCards(): CardCount[] {
		const counts = super.countCards()
		// Upgrade hands where J is not the most frequent count
		const jokersIndex = counts.findIndex((count) => count.symbol === 'J')
		if (jokersIndex >= 0 && counts[jokersIndex].count < 5) {
			const [jokers] = counts.splice(jokersIndex, 1)
			counts[0].count += jokers.count
		}
		return counts
	}
}

await answer(2, (input) => {
	const hands = input.map((hand) => new HandWithJokers(hand))
	hands.sort((a, b) => a.compare(b))
	return calculateWinnings(hands)
})
