"use client"

import React from "react"

export default function HowItWorksPage() {
	return (
		<div className='min-h-screen bg-white text-zinc-800 px-6 py-12 md:px-16'>
			{/* Hero Section */}
			<section className='max-w-4xl mx-auto text-center mb-20'>
				<h1 className='text-4xl md:text-5xl font-bold mb-4 text-indigo-700'>
					How It Works
				</h1>
				<p className='text-lg text-zinc-600 max-w-2xl mx-auto'>
					Master your interviews with realistic practice sessions, real-time
					feedback, and AI-generated insights — all in one place.
				</p>
			</section>

			{/* Steps Section */}
			<section className='max-w-6xl mx-auto grid gap-10 md:grid-cols-3 mb-24'>
				{[
					{
						title: "Start an Interview",
						desc: "Choose a topic or let the AI select one. Get real interview questions instantly, tailored to your level.",
					},
					{
						title: "Record Your Answer",
						desc: "Use your mic and webcam to simulate a real interview. No pressure — just practice, anytime.",
					},
					{
						title: "Get Instant Feedback",
						desc: "Receive detailed, AI-generated feedback with ratings and suggestions to level up your performance.",
					},
				].map((step, idx) => (
					<div
						key={idx}
						className='bg-zinc-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all'
					>
						<div className='text-sm text-indigo-600 font-medium mb-2'>
							Step {idx + 1}
						</div>
						<h3 className='text-xl font-semibold mb-3 text-zinc-900'>
							{step.title}
						</h3>
						<p className='text-zinc-600'>{step.desc}</p>
					</div>
				))}
			</section>

			{/* Benefits Section */}
			<section className='max-w-5xl mx-auto mb-24'>
				<h2 className='text-3xl font-bold text-indigo-700 text-center mb-8'>
					Why Practice Here?
				</h2>
				<div className='grid md:grid-cols-2 gap-8 text-zinc-700 text-lg'>
					<div className='bg-white rounded-xl border p-6'>
						<h4 className='font-semibold mb-2 text-zinc-900'>
							Realistic Interview Questions
						</h4>
						<p>
							Get access to top tech interview questions curated by AI and
							industry experts.
						</p>
					</div>
					<div className='bg-white rounded-xl border p-6'>
						<h4 className='font-semibold mb-2 text-zinc-900'>
							Tailored Feedback
						</h4>
						<p>
							Receive personalized ratings and actionable suggestions based on
							your answers.
						</p>
					</div>
					<div className='bg-white rounded-xl border p-6'>
						<h4 className='font-semibold mb-2 text-zinc-900'>
							Speech & Communication Focus
						</h4>
						<p>
							Sharpen your articulation and confidence with audio-based
							interview simulation.
						</p>
					</div>
					<div className='bg-white rounded-xl border p-6'>
						<h4 className='font-semibold mb-2 text-zinc-900'>
							Track Your Progress
						</h4>
						<p>
							Monitor your improvement over time with session history and
							evolving ratings.
						</p>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className='text-center'>
				<h3 className='text-2xl font-semibold mb-4'>
					Ready to practice like a pro?
				</h3>
				<a
					href='/dashboard'
					className='inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition'
				>
					Get Started
				</a>
			</section>
		</div>
	)
}
