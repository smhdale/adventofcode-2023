export type Coord = { x: number; y: number }
export type Vec2d = [Coord, Coord]

export function crossProduct(a: Vec2d, b: Vec2d) {
	const [p1, q1] = a
	const [p2, q2] = b
}

export function lineSegmentsIntersect(a: Vec2d, b: Vec2d): boolean {}
