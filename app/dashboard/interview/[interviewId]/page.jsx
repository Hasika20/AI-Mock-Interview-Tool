"use client"
import { Button } from "@/components/ui/button"
import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { eq } from "drizzle-orm"
import { Lightbulb, WebcamIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import Webcam from "react-webcam"
import { useParams } from "next/navigation"
import Link from "next/link"

function Interview() {
	const [interviewData, setInterviewData] = useState(null)
	const [webCamEnabled, setWebCamEnabled] = useState(false)

	const params = useParams()
	const interviewId = params.interviewId

	useEffect(() => {
		if (interviewId) {
			console.log("Interview ID:", interviewId)
			GetInterviewDetails()
		}
	}, [interviewId])

	const GetInterviewDetails = async () => {
		const result = await db
			.select()
			.from(MockInterview)
			.where(eq(MockInterview.mockId, interviewId))

		console.log("Fetched Interview:", result)
		setInterviewData(result[0])
	}

	if (!interviewData) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<p className='text-lg font-medium text-muted-foreground'>
					Fetching interview details...
				</p>
			</div>
		)
	}

	return (
		<div className='my-10 px-5 md:px-20'>
			<h2 className='font-bold text-3xl mb-6 text-center text-primary'>
				Ready to Ace This Interview?
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
				<div className='flex flex-col gap-6 bg-white dark:bg-secondary border rounded-xl shadow-md p-6'>
					<div className='space-y-3'>
						<h2 className='text-lg'>
							<span className='font-semibold text-muted-foreground'>
								Job Role:
							</span>{" "}
							{interviewData.jobPosition}
						</h2>
						<h2 className='text-lg'>
							<span className='font-semibold text-muted-foreground'>
								Tech Stack:
							</span>{" "}
							{interviewData.jobDesc}
						</h2>
						<h2 className='text-lg'>
							<span className='font-semibold text-muted-foreground'>
								Experience:
							</span>{" "}
							{interviewData.jobExperience} year(s)
						</h2>
					</div>

					<div className='bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md border border-yellow-300'>
						<h2 className='flex items-center gap-2 text-yellow-800 dark:text-yellow-200 font-medium'>
							<Lightbulb className='w-5 h-5' /> Important Info
						</h2>
						<p className='mt-2 text-sm text-yellow-700 dark:text-yellow-100 leading-relaxed'>
							{process.env.NEXT_PUBLIC_INFORMATION}
						</p>
					</div>
				</div>

				<div className='flex flex-col items-center gap-6'>
					{webCamEnabled ? (
						<Webcam
							onUserMedia={() => setWebCamEnabled(true)}
							onUserMediaError={() => setWebCamEnabled(false)}
							mirrored={true}
							style={{
								borderRadius: "0.75rem",
								border: "2px solid #e5e7eb",
								width: "100%",
								maxWidth: "400px",
								height: "auto",
							}}
						/>
					) : (
						<>
							<WebcamIcon className='h-64 w-full p-20 bg-secondary text-muted-foreground rounded-lg border' />
							<Button
								variant='secondary'
								onClick={() => setWebCamEnabled(true)}
							>
								Enable Webcam & Mic
							</Button>
						</>
					)}
				</div>
			</div>

			<div className='flex justify-end mt-10'>
				<Link href={`/dashboard/interview/${interviewId}/start`}>
					<Button className='px-6 py-2 text-lg'>Start Interview</Button>
				</Link>
			</div>
		</div>
	)
}

export default Interview
