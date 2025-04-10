"use client"

import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { useUser } from "@clerk/nextjs"
import { desc, eq } from "drizzle-orm"
import React, { useEffect, useState } from "react"
import InterviewItemCard from "./InterviewItemCard"
import { ClipboardList } from "lucide-react"

function InterviewList() {
	const { user } = useUser()
	const [interviewList, setInterviewList] = useState([])

	useEffect(() => {
		if (user) GetInterviewList()
	}, [user])

	const GetInterviewList = async () => {
		const result = await db
			.select()
			.from(MockInterview)
			.where(
				eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress)
			)
			.orderBy(desc(MockInterview.id))
		setInterviewList(result)
	}

	return (
		<div className='mt-12 px-4 md:px-10 text-primary'>
			{/* Header */}
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-3'>
					<ClipboardList className='w-7 h-7 text-blue-500' />
					<h2 className='text-2xl font-bold tracking-tight'>
						Your Mock Interviews
					</h2>
				</div>
			</div>

			{/* Grid layout */}
			{interviewList.length > 0 ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{interviewList.map((interview, index) => (
						<InterviewItemCard interview={interview} key={index} />
					))}
				</div>
			) : (
				<div className='text-center mt-10 text-zinc-400 text-lg'>
					You haven’t created any interviews yet.
					<br />
					<span className='text-sm'>
						Click "Start" to launch your first one
					</span>
				</div>
			)}
		</div>
	)
}

export default InterviewList
