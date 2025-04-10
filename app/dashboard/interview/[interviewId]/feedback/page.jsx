"use client"

import { db } from "@/utils/db"
import { userAnswer } from "@/utils/schema"
import { eq, desc } from "drizzle-orm"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { BadgeCheck, Star } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

function Feedback() {
	const params = useParams()
	const interviewId = params?.interviewId
	const [filteredAnswers, setFilteredAnswers] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (interviewId) {
			GetFeedback()
		}
	}, [interviewId])

	const GetFeedback = async () => {
		try {
			const result = await db
				.select()
				.from(userAnswer)
				.where(eq(userAnswer.mockIdRef, interviewId))
				.orderBy(desc(userAnswer.createdAt))

			const seenQuestions = new Set()
			const filteredResult = result.filter((entry) => {
				if (!seenQuestions.has(entry.question)) {
					seenQuestions.add(entry.question)
					return true
				}
				return false
			})

			setFilteredAnswers(filteredResult)
		} catch (err) {
			console.error("Error fetching feedback:", err)
		} finally {
			setLoading(false)
		}
	}

	const validRatings = filteredAnswers
		.map((ans) => ans.rating ?? null)
		.filter((r) => r !== null)

	const total = validRatings.reduce((sum, r) => sum + r, 0)
	const avg = validRatings.length
		? (total / validRatings.length).toFixed(1)
		: null

	return (
		<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white py-10 px-4 md:px-10'>
			<div className='max-w-5xl mx-auto'>
				{!loading && filteredAnswers.length === 0 ? (
					<div className='text-center mt-20'>
						<h2 className='text-2xl font-bold text-gray-400 mb-4'>
							No interview feedback found
						</h2>
						<p className='text-zinc-500'>
							It looks like you haven't answered or submitted this interview
							yet.
						</p>
						<Link
							href='/dashboard'
							className='inline-block mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition'
						>
							Back to Dashboard
						</Link>
					</div>
				) : (
					<>
						<div className='text-center mb-10'>
							<h1 className='text-4xl font-extrabold text-green-500 flex items-center justify-center gap-2'>
								<BadgeCheck className='w-8 h-8 text-green-400 animate-pulse' />
								Congratulations!
							</h1>
							<h2 className='text-xl mt-3 text-zinc-300'>
								You completed your mock interview
							</h2>

							{avg !== null && (
								<div className='mt-5 text-2xl font-semibold text-blue-400 flex items-center justify-center gap-2'>
									<Star className='text-yellow-400' />
									Overall Rating: <span className='text-white'>{avg}/10</span>
								</div>
							)}
						</div>

						<div className='space-y-8'>
							{filteredAnswers.map((answer, index) => (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
									key={answer.id || index}
									className='bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-md hover:shadow-xl transition-shadow duration-300'
								>
									<div className='flex justify-between items-center mb-3'>
										<h3 className='text-lg font-semibold text-white'>
											Question {index + 1}
										</h3>
										<span className='text-sm text-yellow-400 font-medium'>
											Rating:{" "}
											{answer.rating !== null
												? `${answer.rating}/10`
												: "Not Rated"}
										</span>
									</div>

									<p className='text-zinc-300 mb-2'>
										<span className='font-medium text-zinc-400'>Q:</span>{" "}
										{answer.question}
									</p>

									<p className='text-zinc-400 mb-2'>
										<span className='font-medium text-white'>Your Answer:</span>{" "}
										{answer.userAns?.trim()
											? answer.userAns
											: "Answer not recorded"}
									</p>

									{answer.correctAns && (
										<p className='text-green-400 mb-2'>
											<span className='font-medium'>Correct Answer:</span>{" "}
											{answer.correctAns}
										</p>
									)}

									{answer.feedback && (
										<p className='text-blue-400'>
											<span className='font-medium'>AI Feedback:</span>{" "}
											{answer.feedback}
										</p>
									)}
								</motion.div>
							))}
						</div>

						<div className='mt-10 flex justify-center'>
							<Link
								href='/dashboard'
								className='inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-300'
							>
								Back to Dashboard
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Feedback
