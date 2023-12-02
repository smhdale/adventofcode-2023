import { getInput, getSample } from "./input"

type AnswerFn = (input: string[]) => unknown | Promise<unknown>

export async function answer(part: 1 | 2, resolveAnswer: AnswerFn) {
	console.log(`=== Part ${part} ===`)

	const sampleInput = await getSample()
	const sampleAnswer = await resolveAnswer(sampleInput)
	console.log('Sample answer:', sampleAnswer)

	const input = await getInput()
	const answer = await resolveAnswer(input)
	console.log('Final answer: ', answer)
}
