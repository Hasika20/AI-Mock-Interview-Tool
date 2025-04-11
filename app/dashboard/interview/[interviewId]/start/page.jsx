"use client"

import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { eq } from "drizzle-orm"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import QuestionsSection from "./_components/QuestionsSection"
import RecordAnswerSection from "./_components/RecordAnswerSection"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function StartInterview() {
	const [interviewData, setInterviewData] = useState(null)
	const [mockInterviewQuestion, setMockInterviewQuestion] = useState([])
	const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

	const params = useParams()
	const interviewId = params?.interviewId

	useEffect(() => {
		if (interviewId) {
			GetInterviewDetails()
		}
	}, [interviewId])

	const GetInterviewDetails = async () => {
		try {
			const result = await db
				.select()
				.from(MockInterview)
				.where(eq(MockInterview.mockId, interviewId))

			if (result.length > 0) {
				let parsedJson
				try {
					parsedJson = JSON.parse(result[0].jsonMockResp)

					// 👇 Gracefully handle both old and new formats
					const questions =
						parsedJson.questions ?? parsedJson.questions_and_answers ?? []

					setMockInterviewQuestion(questions)
					setInterviewData(result[0])
				} catch (err) {
					console.error("🧨 Error parsing jsonMockResp", err)
				}
			}
		} catch (error) {
			console.error("❌ Failed to load interview details:", error)
		}
	}

	return (
		<div className='min-h-screen bg-zinc-950 text-white px-4 md:px-10 py-10'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-4xl font-bold mb-8 text-center md:text-left'>
					Mock Interview
				</h1>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
					{/* Sidebar */}
					<aside className='lg:col-span-2 hidden lg:block sticky top-20'>
						<div className='bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-sm'>
							<h2 className='text-lg font-semibold mb-4'>Navigate</h2>
							<div className='grid grid-cols-2 gap-2'>
								{mockInterviewQuestion.map((_, idx) => (
									<Button
										key={idx}
										variant={
											idx === activeQuestionIndex ? "default" : "secondary"
										}
										className='text-xs font-medium'
										onClick={() => setActiveQuestionIndex(idx)}
									>
										Q{idx + 1}
									</Button>
								))}
							</div>
						</div>
					</aside>

					{/* Question + Answer Recording */}
					<section className='lg:col-span-10 grid md:grid-cols-2 gap-6'>
						<div className='bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-800'>
							<QuestionsSection
								activeQuestionIndex={activeQuestionIndex}
								mockInterviewQuestion={mockInterviewQuestion}
							/>
						</div>

						<div className='bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-800'>
							<RecordAnswerSection
								activeQuestionIndex={activeQuestionIndex}
								mockInterviewQuestion={mockInterviewQuestion}
								interviewData={interviewData}
							/>
						</div>
					</section>
				</div>

				{/* Navigation Buttons */}
				<div className='flex flex-col md:flex-row justify-end items-center gap-4 mt-10 border-t pt-6 border-zinc-800'>
					{activeQuestionIndex > 0 && (
						<Button
							variant='secondary'
							onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
							className='min-w-[140px]'
						>
							Previous
						</Button>
					)}

					{mockInterviewQuestion.length > 0 &&
						activeQuestionIndex < mockInterviewQuestion.length - 1 && (
							<Button
								onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
								className='min-w-[140px]'
							>
								Next
							</Button>
						)}

					{mockInterviewQuestion.length > 0 &&
						activeQuestionIndex === mockInterviewQuestion.length - 1 && (
							<Link
								href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
								passHref
							>
								<Button className='bg-green-600 hover:bg-green-700 min-w-[140px]'>
									End Interview
								</Button>
							</Link>
						)}
				</div>
			</div>
		</div>
	)
}

export default StartInterview
