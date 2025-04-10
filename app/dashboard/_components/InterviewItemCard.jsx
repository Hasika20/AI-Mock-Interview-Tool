import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React from "react"
import { CalendarClock, Briefcase, User } from "lucide-react"

function InterviewItemCard({ interview }) {
	const router = useRouter()

	const onStart = () => {
		router.push("/dashboard/interview/" + interview.mockId)
	}

	const onFeedbackPress = () => {
		router.push("/dashboard/interview/" + interview.mockId + "/feedback")
	}

	return (
		<div className='rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
			{/* Job Title */}
			<h2 className='text-xl font-bold text-white flex items-center gap-2 mb-2'>
				<Briefcase className='w-5 h-5 text-green-400' />
				{interview?.jobPosition}
			</h2>

			{/* Experience */}
			<p className='text-sm text-zinc-400 flex items-center gap-2 mb-1'>
				<User className='w-4 h-4 text-blue-400' />
				{interview?.jobExperience} years experience
			</p>

			{/* Created At */}
			<p className='text-xs text-zinc-500 flex items-center gap-2 mb-4'>
				<CalendarClock className='w-4 h-4 text-yellow-400' />
				Created at: {interview?.createdAt}
			</p>

			{/* Buttons Inside Card */}
			<div className='grid grid-cols-2 gap-3 mt-4'>
				<Button
					variant='outline'
					className='w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors duration-200'
					onClick={onFeedbackPress}
				>
					View Feedback
				</Button>
				<Button
					className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-200'
					onClick={onStart}
				>
					Start Interview
				</Button>
			</div>
		</div>
	)
}

export default InterviewItemCard
