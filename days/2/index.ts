import { answer } from '../../lib/answer'

/**
 * Part 1
 */

type Colour = 'r' | 'g' | 'b'

class Game {
	public readonly id: number
	public readonly maximums: Record<Colour, number>

	constructor(input: string) {
		const [game, hands] = input.split(': ')

		this.id = Number(game.replace('Game ', ''))
		this.maximums = {
			r: 0,
			g: 0,
			b: 0,
		}

		this.countMaximums(hands)
	}

	private countMaximums(record: string) {
		const hands = record.split('; ')
		for (const hand of hands) {
			this.countHand(hand)
		}
	}

	private static getColourKey(input: string): Colour {
		switch (input) {
			case 'red':
				return 'r'
			case 'green':
				return 'g'
			default:
				return 'b'
		}
	}

	private countHand(hand: string) {
		for (const cubes of hand.split(', ')) {
			const [count, colour] = cubes.split(' ')
			const key = Game.getColourKey(colour)
			this.maximums[key] = Math.max(this.maximums[key], Number(count))
		}
	}

	public get power(): number {
		return this.maximums.r * this.maximums.g * this.maximums.b
	}
}

await answer(1, (input) => {
	const games = input.map((record) => new Game(record))
	const maximums: Record<Colour, number> = {
		r: 12,
		g: 13,
		b: 14,
	}

	let sum = 0
	for (const game of games) {
		if (
			game.maximums.r <= maximums.r &&
			game.maximums.g <= maximums.g &&
			game.maximums.b <= maximums.b
		) {
			sum += game.id
		}
	}
	return sum
})

/**
 * Part 2
 */

await answer(2, (input) => {
	return input.reduce((acc, record) => {
		const game = new Game(record)
		return acc + game.power
	}, 0)
})
