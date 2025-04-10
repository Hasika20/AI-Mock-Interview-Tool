"use client"

import React, { useState } from "react"

const topics = [
	{ id: "dsa", label: "Data Structures & Algorithms" },
	{ id: "system", label: "System Design" },
	{ id: "behavioral", label: "Behavioral" },
	{ id: "react", label: "React.js" },
]

const questionsByTopic = {
	dsa: [
		{
			question: "Explain how a HashMap works.",
			answers: [
				"A HashMap uses a hash function to compute an index into an array of buckets, from which the desired value can be found.",
				"Collisions are handled by chaining or open addressing.",
				"Its average time complexity is O(1) for get and put operations.",
				"Internally, keys are hashed and then used to determine where to store values.",
			],
		},
		{
			question: "What is the time complexity of merge sort?",
			answers: [
				"Merge sort has a time complexity of O(n log n) in all cases.",
				"It uses a divide-and-conquer strategy.",
				"It’s stable and works well for linked lists.",
				"The merge step takes linear time and dominates the recursion.",
			],
		},
	],
	system: [
		{
			question: "How would you design a URL shortener like bit.ly?",
			answers: [
				"Use a base62 encoded string as the short key.",
				"Store the mapping in a distributed key-value store like Redis.",
				"Use a counter or hash of the original URL to generate unique keys.",
				"Ensure rate-limiting and analytics features.",
			],
		},
	],
	behavioral: [
		{
			question: "Tell me about a time you faced a conflict in a team.",
			answers: [
				"I listened actively to understand both perspectives before jumping to conclusions.",
				"I encouraged a team retro to create an open space for discussing friction points.",
				"I focused on the shared goal to realign our efforts.",
				"The resolution helped us deliver our sprint ahead of time.",
			],
		},
	],
	react: [
		{
			question: "What are React hooks?",
			answers: [
				"Hooks let you use state and lifecycle features in functional components.",
				"The most common ones are useState and useEffect.",
				"They promote cleaner, reusable logic via custom hooks.",
				"They eliminate the need for class components.",
			],
		},
	],
}

export default function Questions() {
	const [activeTopic, setActiveTopic] = useState("dsa")

	return (
		<div className='flex min-h-screen bg-zinc-50'>
			{/* Sidebar */}
			<aside className='w-64 bg-white shadow-md border-r p-6 space-y-4'>
				<h2 className='text-xl font-semibold mb-4 text-indigo-600'>Topics</h2>
				{topics.map((topic) => (
					<button
						key={topic.id}
						className={`block text-left px-4 py-2 rounded-lg w-full ${
							activeTopic === topic.id
								? "bg-indigo-100 text-indigo-700 font-bold"
								: "hover:bg-zinc-100 text-zinc-700"
						}`}
						onClick={() => setActiveTopic(topic.id)}
					>
						{topic.label}
					</button>
				))}
			</aside>

			{/* Main Content */}
			<main className='flex-1 p-10'>
				<h1 className='text-3xl font-bold text-zinc-800 mb-6'>
					{topics.find((t) => t.id === activeTopic)?.label}
				</h1>

				{questionsByTopic[activeTopic]?.map((q, index) => (
					<div
						key={index}
						className='mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm'
					>
						<h2 className='text-xl font-semibold text-indigo-700 mb-3'>
							{index + 1}. {q.question}
						</h2>
						<ul className='list-disc list-inside space-y-2 text-gray-700'>
							{q.answers.map((ans, idx) => (
								<li key={idx}>{ans}</li>
							))}
						</ul>
					</div>
				))}
			</main>
		</div>
	)
}
