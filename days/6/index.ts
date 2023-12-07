import { answer } from '../../lib/answer'

/**
 * Part 1
 */

class BoatRace {
	public readonly time: number
	public readonly record: number

	constructor(time: number, record: number) {
		this.time = time
		this.record = record
	}

	public chargeBoat(time: number) {
		return (this.time - time) * time
	}

	public getWinningChargeTimes(): number {
		let wins = 0
		for (let i = 0; i <= this.time; i++) {
			const dist = this.chargeBoat(i)
			if (dist > this.record) wins++
		}
		return wins
	}
}

function createRacesFromInput(input: string[]): BoatRace[] {
	const [, ...times] = input[0].split(/ +/).map(Number)
	const [, ...dists] = input[1].split(/ +/).map(Number)
	return times.map((time, index) => {
		const record = dists[index]
		return new BoatRace(time, record)
	})
}

await answer(1, (input) => {
	const races = createRacesFromInput(input)
	return races.reduce((product, race) => {
		return product * race.getWinningChargeTimes()
	}, 1)
})

/**
 * Part 2
 */

function createRaceFromInput(input: string[]): BoatRace {
	const [, time] = input[0].replace(/ */g, '').split(':').map(Number)
	const [, dist] = input[1].replace(/ */g, '').split(':').map(Number)
	return new BoatRace(time, dist)
}

await answer(2, (input) => {
	const race = createRaceFromInput(input)
	return race.getWinningChargeTimes()
})
