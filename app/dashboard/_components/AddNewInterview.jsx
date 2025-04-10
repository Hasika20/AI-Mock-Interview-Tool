"use client"
import React, { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from "@/utils/GeminiAIModel"
import { LoaderCircle, Sparkles } from "lucide-react"
import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { v4 as uuidv4 } from "uuid"
import { useUser } from "@clerk/nextjs"
import moment from "moment"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

function AddNewInterview() {
	const [openDialog, setOpenDialog] = useState(false)
	const [jobPosition, setJobPosition] = useState("")
	const [jobDesc, setJobDesc] = useState("")
	const [jobExperience, setJobExperience] = useState("")
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { user } = useUser()

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		const InputPrompt = `
You are a smart mock interview generator.

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Years of Experience: ${jobExperience}

Give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} mock interview questions as a JSON array. Each item should be an object with the following structure:

{
  "question": "Sample question?",
  "answer": ""
}

Return ONLY the array.
		`

		try {
			const result = await chatSession.sendMessage(InputPrompt)
			const MockJsonResp = (await result.response.text())
				.replace(/```json|```/g, "")
				.trim()

			const parsedQuestions = JSON.parse(MockJsonResp)

			if (!Array.isArray(parsedQuestions)) {
				throw new Error("Invalid format: Expected a JSON array.")
			}

			const resp = await db
				.insert(MockInterview)
				.values({
					mockId: uuidv4(),
					jsonMockResp: parsedQuestions,
					jobPosition,
					jobDesc,
					jobExperience,
					createdBy: user?.primaryEmailAddress?.emailAddress,
					createdAt: moment().format("DD-MM-YYYY"),
				})
				.returning({ mockId: MockInterview.mockId })

			setOpenDialog(false)
			router.push("/dashboard/interview/" + resp[0]?.mockId)
		} catch (error) {
			console.error("Error generating mock interview:", error)
		}

		setLoading(false)
	}

	return (
		<div>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.98 }}
				className='p-10 border border-dashed rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-white hover:shadow-lg transition-all cursor-pointer'
				onClick={() => setOpenDialog(true)}
			>
				<div className='flex flex-col items-center gap-2'>
					<Sparkles className='text-blue-500' />
					<h2 className='text-xl font-semibold'>+ Add New Interview</h2>
					<p className='text-sm text-zinc-400'>Start a fresh mock interview</p>
				</div>
			</motion.div>

			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className='max-w-3xl bg-zinc-950 text-white border border-zinc-800'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold text-blue-400'>
							Let’s build your mock interview
						</DialogTitle>
						<DialogDescription className='text-sm text-zinc-400 mt-1'>
							Give us a few details and we’ll spin up an AI-powered experience
							tailored for you.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onSubmit} className='space-y-6 mt-4'>
						<div className='space-y-1'>
							<label
								htmlFor='job-role'
								className='text-sm font-medium text-zinc-300'
							>
								Job Role / Position
							</label>
							<Input
								id='job-role'
								placeholder='e.g. Frontend Developer'
								className='bg-zinc-900 text-white'
								required
								value={jobPosition}
								onChange={(e) => setJobPosition(e.target.value)}
							/>
						</div>

						<div className='space-y-1'>
							<label
								htmlFor='job-desc'
								className='text-sm font-medium text-zinc-300'
							>
								Job Description / Tech Stack
							</label>
							<Textarea
								id='job-desc'
								placeholder='e.g. React, TailwindCSS, TypeScript, GraphQL...'
								className='bg-zinc-900 text-white'
								required
								value={jobDesc}
								onChange={(e) => setJobDesc(e.target.value)}
							/>
						</div>

						<div className='space-y-1'>
							<label
								htmlFor='experience'
								className='text-sm font-medium text-zinc-300'
							>
								Experience (in Years)
							</label>
							<Input
								id='experience'
								type='number'
								max='40'
								placeholder='e.g. 3'
								className='bg-zinc-900 text-white'
								required
								value={jobExperience}
								onChange={(e) => setJobExperience(e.target.value)}
							/>
						</div>

						<div className='flex justify-end gap-3 pt-4'>
							<Button
								type='button'
								variant='ghost'
								onClick={() => setOpenDialog(false)}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								className='bg-blue-600 hover:bg-blue-700 text-white'
								disabled={loading}
							>
								{loading ? (
									<>
										<LoaderCircle className='animate-spin mr-2' />
										Generating...
									</>
								) : (
									"Start Interview"
								)}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default AddNewInterview
