import { answer } from '../../lib/answer'
import { groupInput } from '../../lib/input'

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

function parseInput(input: string[]) {
	const [[directions], nodes] = groupInput(input)
	const nav = createNavigator(directions)
	const map = chartMap(nodes)
	return { nav, map }
}

await answer(1, (input) => {
	const { nav, map } = parseInput(input)

	let step = 1
	let node = map.get('AAA')

	while (node) {
		const dir = nav.next()
		node = node.get(dir.value)
		if (node?.id === 'ZZZ') return step
		step++
	}
})

/**
 * Part 2
 */

class Path {
	private readonly map: NodeMap
	private node: Node

	constructor(map: NodeMap, startNodeId: string) {
		this.map = map
		const node = this.map.get(startNodeId)
		if (!node) throw new Error(`Node ${startNodeId} not found`)
		this.node = node
	}

	public get nodeId(): string {
		return this.node.id
	}

	public step(direction: string) {
		const node = this.node.get(direction)
		if (!node) throw new Error(`Node ${this.nodeId} -> ${direction} not found`)
		this.node = node
	}

	public atEndNode(): boolean {
		return this.nodeId.endsWith('Z')
	}
}

await answer(2, (input) => {
	const { nav, map } = parseInput(input)

	const paths = Array.from(map.keys())
		.filter((key) => key.endsWith('A'))
		.map((key) => new Path(map, key))

	let step = 0
	while (paths.some((path) => !path.atEndNode())) {
		const dir = nav.next()
		for (const path of paths) path.step(dir.value)
		step++
	}

	return step
})
