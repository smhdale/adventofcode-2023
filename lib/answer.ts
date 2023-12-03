import { getInput, getSample } from './input'

type InputMode = 'sample' | 'actual'
type AnswerMeta = {
	day: number
	part: number
	mode: InputMode
}
type AnswerFn = (
	input: string[],
	meta: AnswerMeta,
) => unknown | Promise<unknown>

export async function answer(part: 1 | 2, resolveAnswer: AnswerFn) {
	const day = Number(Bun.env.DAY)
	Bun.env.PART = String(part)
	console.log(`=== Part ${part} ===`)

	const sampleInput = await getSample()
	const sampleAnswer = await resolveAnswer(sampleInput, {
		day,
		part,
		mode: 'sample',
	})
	console.log('Sample answer:', sampleAnswer)

	const input = await getInput()
	const answer = await resolveAnswer(input, {
		day,
		part,
		mode: 'actual',
	})
	console.log('Final answer: ', answer)
}
