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
import { LoaderCircle } from "lucide-react"
import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { v4 as uuidv4 } from "uuid"
import { useUser } from "@clerk/nextjs"
import moment from "moment"
import { useRouter } from "next/navigation"

function AddNewInterview() {
	const [openDialog, setOpenDialog] = useState(false)
	const [jobPosition, setJobPosition] = useState()
	const [jobDesc, setJobDesc] = useState()
	const [jobExperience, setJobExperience] = useState()
	const [loading, setLoading] = useState(false)
	const [jsonResponse, setJsonResponse] = useState([])
	const router = useRouter()
	const { user } = useUser()

	const onSubmit = async (e) => {
		setLoading(true)
		e.preventDefault()
		console.log(jobPosition, jobDesc, jobExperience)

		const InputPrompt =
			"Job Position: " +
			jobPosition +
			" Job Description: " +
			jobDesc +
			" Years of experience: " +
			jobExperience +
			" Depending on the Job Position, Job Description, Years of job experience give us " +
			process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
			" interview questions along with answers in Json format, Give questions and answers as field in JSON"

		try {
			const result = await chatSession.sendMessage(InputPrompt)

			const MockJsonResp = (await result.response.text())
				.replace(/```json|```/g, "") // 🧼 strip code block wrappers
				.trim()

			const jsonMockResp = JSON.parse(MockJsonResp)
			setJsonResponse(jsonMockResp)

			const inserted = await db
				.insert(MockInterview)
				.values({
					mockId: uuidv4(),
					jsonMockResp,
					jobPosition,
					jobDesc,
					jobExperience,
					createdBy: user?.primaryEmailAddress?.emailAddress,
					createdAt: moment().format("DD-MM-YYYY"),
				})
				.returning({ mockId: MockInterview.mockId })

			const newMockId = inserted[0]?.mockId
			if (newMockId) {
				setOpenDialog(false)
				router.push(`/dashboard/interview/${newMockId}`)
			} else {
				console.error("Failed to get mockId")
			}
		} catch (err) {
			console.error("Something went sideways with the request or insert:", err)
		}
		setLoading(false)
	}

	return (
		<div>
			<div
				className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
				onClick={() => setOpenDialog(true)}
			>
				<h2 className='text-lg text-center font-medium'>+ Add New</h2>
			</div>

			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className='max-w-3xl'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-semibold'>
							Setting the Stage for Your Mock Interview
						</DialogTitle>
						<DialogDescription className='text-muted-foreground'>
							Provide a few details to tailor your mock interview experience.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onSubmit} className='space-y-6 mt-4'>
						<div className='space-y-2'>
							<label htmlFor='job-role' className='block text-sm font-medium'>
								Job Role / Position
							</label>
							<Input
								id='job-role'
								placeholder='Ex: Full Stack Developer'
								required
								onChange={(e) => setJobPosition(e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<label htmlFor='job-desc' className='block text-sm font-medium'>
								Job Description / Tech Stack
							</label>
							<Textarea
								id='job-desc'
								placeholder='Ex: MongoDB, ExpressJs, ReactJs, NodeJs (MERN)'
								required
								onChange={(e) => setJobDesc(e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<label htmlFor='experience' className='block text-sm font-medium'>
								Experience (in Years)
							</label>
							<Input
								id='experience'
								placeholder='Ex: 5'
								type='number'
								max='40'
								required
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
								className='cursor-pointer'
								disabled={loading}
							>
								{loading ? (
									<>
										<LoaderCircle className='animate-spin' />
										Generating, Please wait...
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
