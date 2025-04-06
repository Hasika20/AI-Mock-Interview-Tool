"use client"

import { SignUp } from "@clerk/nextjs"
import Image from "next/image"

export default function SignUpPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<div className='flex flex-col items-center space-y-6'>
				<Image
					src='/logo.jpeg'
					alt='AI Mock Interview Tool Logo'
					width={300}
					height={300}
					className='rounded-xl'
				/>
				<h1 className='text-2xl font-bold text-primary'>Create Your Account</h1>
				<p className='text-zinc-500'>Join the AI Mock Interview Tool</p>

				<div className='bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl'>
					<SignUp
						appearance={{
							elements: {
								card: "shadow-none bg-transparent",
								footer: "hidden",
							},
							variables: {
								colorPrimary: "#3b82f6",
							},
						}}
					/>
				</div>
			</div>
		</div>
	)
}
