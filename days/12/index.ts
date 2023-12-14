import { answer } from '../../lib/answer'
import { listCombinations } from '../../lib/combinations'
import { combinations, sum } from '../../lib/math'

/**
 * Part 1
 */

interface ISprings {
	width: number
	blocks: number[]
	slots: number
	checkMask: number
	validateMask: number
	configurations: number
}

function parseSprings(input: string): ISprings {
	const [rawMask, rawBlocks] = input.split(' ')
	const width = rawMask.length

	const checkMask = Number.parseInt(
		rawMask.replace(/[.]/g, '0').replace(/[#?]/g, '1'),
		2,
	)
	const validateMask = Number.parseInt(
		rawMask.replace(/[.?]/g, '0').replace(/[#]/g, '1'),
		2,
	)

	const blocks = rawBlocks.split(',').map(Number)
	const slots = width - (sum(blocks) + blocks.length - 1) + blocks.length
	const configurations = combinations(slots, blocks.length)

	return { width, checkMask, validateMask, blocks, slots, configurations }
}

function listConfigurations(springs: ISprings): number[] {
	const { slots, blocks } = springs
	const slotsArray = Array.from({ length: slots }).map((_, i) => i)
	const arrangements = listCombinations(slotsArray, blocks.length)

	const configurations = []
	for (const arrangement of arrangements) {
		let configuration = ''
		for (let i = 0; i < slots; i++) {
			const block = arrangement.indexOf(i)
			if (block > -1) {
				if (block > 0) configuration += '0'
				configuration += '1'.repeat(blocks[block])
			} else {
				configuration += '0'
			}
		}
		configurations.push(Number.parseInt(configuration, 2))
	}
	return configurations
}

function countValidConfigurations(springs: ISprings): number {
	const configs = listConfigurations(springs)
	let validConfigs = 0
	for (const config of configs) {
		if (
			(config & springs.checkMask) === config &&
			(springs.validateMask & config) === springs.validateMask
		) {
			validConfigs++
		}
	}
	return validConfigs
}

await answer(1, (input, meta) => {
	const springsGroups = input.map(parseSprings)

	let totalConfigurations = 0
	for (const springs of springsGroups) {
		totalConfigurations += countValidConfigurations(springs)
	}

	return totalConfigurations
})

/**
 * Part 2
 */

function unfoldAndParseSprings(input: string): ISprings {
	const [mask, blocks] = input.split(' ')
	const unfoldedMask = []
	const unfoldedBlocks = []

	for (let i = 0; i < 5; i++) {
		unfoldedMask.push(mask)
		unfoldedBlocks.push(blocks)
	}

	return parseSprings(`${unfoldedMask.join('?')} ${unfoldedBlocks.join(',')}`)
}

await answer(2, (input) => {
	const springsGroups = input.map(unfoldAndParseSprings)

	let totalConfigurations = 0
	for (const springs of springsGroups) {
		totalConfigurations += countValidConfigurations(springs)
	}

	return totalConfigurations
})
