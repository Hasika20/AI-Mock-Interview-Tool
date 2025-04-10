"use client"

import React, { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition"
import { Mic, MicOff, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { chatSession } from "@/utils/GeminiAIModel"
import { useUser } from "@clerk/nextjs"
import { db } from "@/utils/db"
import moment from "moment"
import { userAnswer as userAnswerTable } from "@/utils/schema"
import { eq, and } from "drizzle-orm"

const Webcam = dynamic(() => import("react-webcam"), { ssr: false })

function RecordAnswerSection({
	mockInterviewQuestion,
	activeQuestionIndex,
	interviewData,
}) {
	const [hasPermission, setHasPermission] = useState(false)
	const [isClient, setIsClient] = useState(false)
	const [loading, setLoading] = useState(false)
	const webcamRef = useRef(null)
	const { user } = useUser()

	const {
		transcript,
		resetTranscript,
		listening,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition()

	useEffect(() => {
		setIsClient(true)
		if (typeof window !== "undefined") {
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: true })
				.then(() => setHasPermission(true))
				.catch(() => {
					setHasPermission(false)
					toast.error(
						"Please allow camera and microphone access to record your answer."
					)
				})
		}
	}, [])

	useEffect(() => {
		if (!listening && transcript.length > 10) {
			updateUserAnswer(transcript)
		}
	}, [listening])

	const StartStopRecording = async () => {
		if (!hasPermission) {
			toast.error("Microphone or camera access not granted.")
			return
		}

		if (listening) {
			SpeechRecognition.stopListening()
			console.log("Recording stopped.")
		} else {
			resetTranscript()
			SpeechRecognition.startListening({ continuous: true })
			console.log("Recording started.")
		}
	}

	const updateUserAnswer = async (userAnswer) => {
		try {
			if (!interviewData || !mockInterviewQuestion[activeQuestionIndex]) return

			setLoading(true)
			console.log("Transcribed answer:", userAnswer)

			// Delete previous answer if exists
			await db
				.delete(userAnswerTable)
				.where(
					and(
						eq(userAnswerTable.mockIdRef, interviewData.mockId),
						eq(
							userAnswerTable.question,
							mockInterviewQuestion[activeQuestionIndex]?.question
						)
					)
				)

			const feedbackPrompt = `
				Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
				User answer: ${userAnswer}
				Give a JSON with "rating" and "feedback" (3-5 lines only).
			`

			const result = await chatSession.sendMessage(feedbackPrompt)
			const cleanJson = (await result.response.text())
				.replace(/```json|```/g, "")
				.trim()
			const parsed = JSON.parse(cleanJson)

			console.log(parsed)

			await db.insert(userAnswerTable).values({
				mockIdRef: interviewData.mockId,
				question: mockInterviewQuestion[activeQuestionIndex]?.question,
				correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
				userAns: userAnswer,
				feedback: parsed.feedback,
				rating: parsed.rating,
				userEmail: user?.primaryEmailAddress?.emailAddress,
				createdAt: moment().format("YYYY-MM-DD"),
			})

			toast.success("Answer recorded and feedback saved.")
		} catch (err) {
			console.error("Failed to save answer:", err)
			toast.error("Something went wrong while saving the answer.")
		} finally {
			resetTranscript()
			setLoading(false)
		}
	}

	if (!isClient || !browserSupportsSpeechRecognition) return null

	return (
		<div className='w-full mt-6 flex flex-col items-center px-4'>
			<div className='bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-3xl shadow-xl p-8 w-full max-w-3xl'>
				<h2 className='text-2xl font-bold text-center mb-6'>
					Record Your Answer
				</h2>

				<div className='relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-600 mb-4'>
					{hasPermission ? (
						<Webcam
							ref={webcamRef}
							className='w-full h-full object-cover'
							mirrored={true}
							audio={false}
						/>
					) : (
						<div className='flex items-center justify-center h-full bg-zinc-800'>
							<Image
								src='/webcam.png'
								width={180}
								height={180}
								alt='webcam placeholder'
								className='opacity-40'
							/>
						</div>
					)}
				</div>

				<p className='text-center text-sm text-white/70 mb-4'>
					{hasPermission
						? "Click the button to start recording. Your response will be submitted after you stop."
						: "Camera and microphone access is required to proceed."}
				</p>

				<div className='flex justify-center'>
					<Button
						disabled={loading}
						onClick={StartStopRecording}
						className={`flex items-center gap-2 px-6 py-3 font-semibold text-md rounded-lg transition-all ${
							listening
								? "bg-red-600 hover:bg-red-700"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
					>
						{loading ? (
							<>
								<LoaderCircle className='animate-spin' size={18} />
								Processing
							</>
						) : listening ? (
							<>
								<MicOff size={18} />
								Stop Recording
							</>
						) : (
							<>
								<Mic size={18} />
								Start Recording
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default RecordAnswerSection
