"use client"

import { Button } from "../components/ui/button"
import Link from "next/link"

export default function Home() {
	return (
		<div className='min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-6 py-12'>
			{/* Hero Section */}
			<section className='text-center max-w-3xl'>
				<h1 className='text-5xl sm:text-6xl font-black tracking-tight text-zinc-900 leading-tight mb-6'>
					Crack Interviews with Confidence
				</h1>

				<p className='text-lg text-zinc-600 mb-10 max-w-xl mx-auto'>
					Get better with every question. Practice mock interviews powered by
					AI, receive insightful feedback, and grow your skills like a pro.
				</p>

				<Link href='/dashboard'>
					<Button className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-md mb-20 shadow-lg'>
						Start Practicing
					</Button>
				</Link>
			</section>

			{/* How it Works */}
			<section className='w-full max-w-5xl'>
				<h2 className='text-3xl font-bold text-center text-zinc-800 mb-14'>
					How It Works
				</h2>

				<div className='grid md:grid-cols-4 gap-8'>
					{[
						{
							title: "Choose a Topic",
							desc: "From DSA to React, select an interview category. Every question is tailored to challenge and prepare you.",
						},
						{
							title: "Record Your Answer",
							desc: "Use text or voice to respond. We'll recreate a real interview setting — time constraints and all.",
						},
						{
							title: "Get AI Feedback",
							desc: "Our smart AI reviews your answers, suggests improvements, and scores your performance.",
						},
						{
							title: "Track Your Growth",
							desc: "Check progress over time. See your scores, revisit past interviews, and improve continuously.",
						},
					].map((step, idx) => (
						<div
							key={idx}
							className='bg-white rounded-xl border border-zinc-200 p-6 shadow-md hover:shadow-xl transition duration-200'
						>
							<div className='text-sm text-indigo-500 font-semibold mb-2'>
								Step {idx + 1}
							</div>
							<h3 className='text-xl font-semibold text-zinc-800 mb-2'>
								{step.title}
							</h3>
							<p className='text-sm text-zinc-600 leading-relaxed'>
								{step.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Footer CTA */}
			<section className='text-center mt-24'>
				<p className='text-zinc-600 mb-4 text-sm'>Ready to level up?</p>
				<Link href='/dashboard'>
					<Button className='bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 text-md shadow'>
						Let’s Begin
					</Button>
				</Link>
			</section>
		</div>
	)
}
