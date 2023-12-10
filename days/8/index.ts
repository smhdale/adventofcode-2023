import { answer } from '../../lib/answer'
import { groupInput } from '../../lib/input'
import { lowestCommonMultiple } from '../../lib/math'

/**
 * Part 1
 */

class Node extends Map<string, Node> {
	public readonly id: string
	constructor(id: string) {
		super()
		this.id = id
	}
}

type NodeMap = Map<string, Node>
type NodeNavigator = Generator<string>

function parseNode(node: string) {
	const match = node.match(/(\w{3}) = \((\w{3}), (\w{3})\)/)
	if (!match) throw new Error(`Error parsing node: ${node}`)
	const [, id, left, right] = match
	return { id, left, right }
}

function chartMap(nodes: string[]): NodeMap {
	const map: NodeMap = new Map()

	for (const { id, left, right } of nodes.map(parseNode)) {
		// Ensure all nodes exist
		const node = map.get(id) ?? new Node(id)
		map.set(id, node)

		const leftNode = map.get(left) ?? new Node(left)
		map.set(left, leftNode)

		const rightNode = map.get(right) ?? new Node(right)
		map.set(right, rightNode)

		// Update connections
		node.set('L', leftNode)
		node.set('R', rightNode)
	}

	return map
}

function* createNavigator(directions: string): NodeNavigator {
	const arr = directions.split('')
	const length = arr.length

	let cursor = 0
	while (true) {
		yield arr[cursor++]
		cursor %= length
	}
}

await answer(1, (input) => {
	const [[directions], nodes] = groupInput(input)
	const nav = createNavigator(directions)
	const map = chartMap(nodes)

	let step = 0
	let node = map.get('AAA')

	while (node) {
		step++
		const turn = nav.next().value
		node = node.get(turn)
		if (node?.id === 'ZZZ') break
	}

	return step
})

/**
 * Part 2
 */

function identifyCycle(
	map: NodeMap,
	directions: string,
	start: string,
): number {
	const nav = createNavigator(directions)

	let step = 0
	let node = map.get(start)

	while (node) {
		step++
		const turn = nav.next().value
		node = node.get(turn)
		if (node?.id.endsWith('Z')) break
	}

	return step
}

await answer(2, (input) => {
	const [[directions], nodes] = groupInput(input)
	const map = chartMap(nodes)

	const starts = Array.from(map.keys()).filter((key) => key.endsWith('A'))
	const cycles = starts.map((start) => identifyCycle(map, directions, start))

	return cycles.reduce((acc, cycle) => lowestCommonMultiple(acc, cycle), 1)
})
