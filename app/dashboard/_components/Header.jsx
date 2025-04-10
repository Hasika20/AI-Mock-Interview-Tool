"use client"

import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { cn } from "@/lib/utils"

function Header() {
	const path = usePathname()
	const router = useRouter()

	const navItems = [
		{ label: "Dashboard", path: "/dashboard" },
		{ label: "Questions", path: "/dashboard/questions" },
		{ label: "Upgrade", path: "/dashboard/upgrade" },
		{ label: "How it works?", path: "/dashboard/how" },
	]

	useEffect(() => {
		console.log("Current path:", path)
	}, [path])

	return (
		<header className='sticky top-0 z-50 bg-zinc-950 shadow-md px-5 md:px-10 py-4 flex items-center justify-between'>
			{/* Logo */}
			<div
				className='flex items-center gap-2 cursor-pointer'
				onClick={() => router.push("/dashboard")}
			>
				<Image
					src='/logo.jpeg'
					width={40}
					height={40}
					alt='logo'
					className='rounded-full'
				/>
				<span className='text-lg font-semibold text-white hidden sm:block'>
					AI Mock Interview
				</span>
			</div>

			{/* Nav Links */}
			<nav className='hidden md:flex items-center gap-8'>
				{navItems.map((item) => (
					<li
						key={item.path}
						className={cn(
							"list-none cursor-pointer text-white hover:text-white hover:scale-105 transition-all font-medium",
							path === item.path && "text-white font-bold"
						)}
						onClick={() => router.push(item.path)}
					>
						{item.label}
					</li>
				))}
			</nav>

			{/* User button */}
			<div className='flex items-center'>
				<UserButton afterSignOutUrl='/' />
			</div>
		</header>
	)
}

export default Header
