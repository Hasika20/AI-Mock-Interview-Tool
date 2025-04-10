"use client"

import { useSearchParams } from "next/navigation"
import PricingPlan from "@/app/_data/PricingPlan"
import { useUser } from "@clerk/nextjs"
import React, { Suspense } from "react"

function UpgradeContent() {
	const { user } = useUser()
	const searchParams = useSearchParams()
	const isSubscribed = searchParams.get("subscribed") === "true"
	const plan = PricingPlan[0]

	if (isSubscribed) {
		return (
			<div className='min-h-screen flex items-center justify-center p-10'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold text-green-600'>
						✅ Subscription Active
					</h2>
					<p className='text-gray-700 mt-2'>
						You're all set! You can now start interviewing 🚀
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-zinc-50 via-white to-zinc-100'>
			<div className='max-w-xl w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center'>
				<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>
					{plan.duration} Plan
				</h1>
				<p className='text-gray-600 text-md mb-6'>
					Perfect for boosting your mock interview game with premium features.
				</p>
				<div className='text-5xl font-extrabold text-indigo-600 mb-1'>
					₹{plan.price}
				</div>
				<div className='text-gray-500 text-sm mb-6'>
					Billed {plan.duration.toLowerCase()}
				</div>
				<ul className='text-left space-y-3 text-gray-700 text-sm mb-8'>
					{[
						"10 mock interviews included",
						"AI-generated questions & feedback",
						"Resume-tailored questions",
						"Email support",
					].map((feature, idx) => (
						<li key={idx} className='flex items-center gap-3'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='2'
								stroke='currentColor'
								className='w-5 h-5 text-green-600'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M4.5 12.75l6 6 9-13.5'
								/>
							</svg>
							{feature}
						</li>
					))}
				</ul>
				<a
					href={
						plan.Link +
						"?prefilled_email=" +
						user?.primaryEmailAddress?.emailAddress
					}
					target='_blank'
					className='inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-full transition-all'
				>
					Upgrade Now
				</a>
			</div>
		</div>
	)
}

export default function UpgradePage() {
	return (
		<Suspense fallback={<div className='p-10 text-center'>Loading...</div>}>
			<UpgradeContent />
		</Suspense>
	)
}
