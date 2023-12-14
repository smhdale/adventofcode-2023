export function sum(numbers: number[]): number {
	return numbers.reduce((acc, num) => acc + num, 0)
}

export function greatestCommonDivisor(a: number, b: number): number {
	const max = a > b ? a : b
	const min = a > b ? b : a
	if (min === 0) return a
	return greatestCommonDivisor(min, max % min)
}

export function lowestCommonMultiple(a: number, b: number): number {
	if (a === 0 && b === 0) return 0
	return (Math.abs(a) * Math.abs(b)) / greatestCommonDivisor(a, b)
}

export function factorial(n: number): number {
	if (n < 2) return 1
	return n * factorial(n - 1)
}

export function combinations(n: number, r: number): number {
	return factorial(n) / (factorial(r) * factorial(n - r))
}
