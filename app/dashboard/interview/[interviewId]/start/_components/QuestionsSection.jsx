import { Lightbulb, Volume2 } from "lucide-react"
import React from "react"

function QuestionsSection({
	mockInterviewQuestion = [],
	activeQuestionIndex = 0,
	onSelectQuestion,
}) {
	const textToSpeech = (text) => {
		if ("speechSynthesis" in window) {
			const speech = new SpeechSynthesisUtterance(text)
			window.speechSynthesis.cancel()
			window.speechSynthesis.speak(speech)
		} else {
			alert("Sorry, your browser does not support this functionality")
		}
	}

	const questions = Array.isArray(mockInterviewQuestion)
		? mockInterviewQuestion
		: mockInterviewQuestion?.questions_and_answers || []

	const currentQuestion = questions[activeQuestionIndex]

	if (!currentQuestion) {
		return (
			<div className='w-full max-w-3xl mx-auto p-6 text-center text-zinc-400'>
				Loading your question...
			</div>
		)
	}

	return (
		<div className='w-full max-w-3xl mx-auto p-6 md:p-8 rounded-xl border border-zinc-800 bg-zinc-900'>
			{/* Question Index Pills */}
			<div className='flex flex-wrap gap-2 mb-6'>
				{questions.map((_, index) => (
					<span
						key={index}
						onClick={() => onSelectQuestion && onSelectQuestion(index)}
						className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
							activeQuestionIndex === index
								? "bg-white text-black font-semibold"
								: "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
						}`}
					>
						Q{index + 1}
					</span>
				))}
			</div>

			{/* Main Question */}
			<div className='flex items-start gap-3 mb-8'>
				<h2 className='text-base md:text-lg font-medium text-white leading-relaxed flex-1'>
					{currentQuestion?.question}
				</h2>
				<Volume2
					className='w-5 h-5 text-zinc-400 hover:text-white cursor-pointer mt-1 transition'
					onClick={() => textToSpeech(currentQuestion?.question)}
				/>
			</div>

			{/* Tip / Note */}
			<div className='p-4 border border-zinc-800 rounded-lg bg-zinc-800/60 flex items-start gap-3 text-sm text-zinc-300'>
				<Lightbulb className='w-4 h-4 text-yellow-300 mt-0.5' />
				<span>
					{process.env.NEXT_PUBLIC_QUESTION_NOTE ||
						"Stay calm and answer confidently. You've got this!"}
				</span>
			</div>
		</div>
	)
}

export default QuestionsSection
