export function eachPair<T>(array: T[], callback: (a: T, b: T) => void): void {
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = i + 1; j < array.length; j++) {
			callback(array[i], array[j])
		}
	}
}
