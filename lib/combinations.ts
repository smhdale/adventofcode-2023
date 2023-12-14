export function eachPair<T>(array: T[], callback: (a: T, b: T) => void): void {
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = i + 1; j < array.length; j++) {
			callback(array[i], array[j])
		}
	}
}

export function listCombinations<T>(array: T[], choose: number) {
	const len = array.length
	const combinations: T[][] = []

	for (let i = 0; i < len; i++) {
		const item = array[i]
		if (choose === 1) {
			combinations.push([item])
		} else {
			for (const combo of listCombinations(array.slice(i + 1), choose - 1)) {
				combinations.push([item, ...combo])
			}
		}
	}

	return combinations
}
