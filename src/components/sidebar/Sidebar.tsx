'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { AboutUser } from './AboutUser'
import { MenuItem } from './MenuItem'
import { getMenu } from './menu.data'

const Sidebar = () => {
	const fullName = localStorage.getItem('username') || 'user'
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()

	return (
		<div>
			{/* 🔵 БОЛЬШИЕ ЭКРАНЫ (hover-эффект) */}
			<aside className='absolute z-10 lg:flex flex-col gap-8 hidden overflow-hidden h-screen transition-width duration-200 group w-16 hover:w-1/5 bg-colors-primary shadow-xl p-2 text-white'>
				<AboutUser
					key='desktop-sidebar'
					fullName={fullName!}
				>
					<div className=' flex-1 flex flex-col gap-2 overflow-hidden'>
						{getMenu(pathname).map(item => (
							<MenuItem item={item} />
						))}
					</div>
				</AboutUser>
			</aside>

			{/* 🔴 МАЛЕНЬКИЕ ЭКРАНЫ (клик для открытия) */}
			<div className='lg:hidden absolute z-100 '>
				{!isOpen && (
					<button
						onClick={() => setIsOpen(!isOpen)}
						className='fixed top-2 left-1 z-50 bg-colors-primary text-white p-2 rounded-md'
					>
						☰
					</button>
				)}

				{/* Выезжающий сайдбар */}
				<aside
					className={`overflow-auto flex flex-col justify-between fixed z-10 top-0 left-0 h-full bg-colors-primary shadow-lg shadow-colors-primaryShadow transform transition-transform ${
						isOpen ? 'translate-x-0' : '-translate-x-full'
					} w-60 `}
				>
					<button
						onClick={() => setIsOpen(false)}
						className='absolute top-3 right-4 rounded-full'
					>
						❌
					</button>

					<AboutUser
						key='mobile-sidebar'
						fullName={fullName}
					>
						<div className='flex flex-1 flex-col gap-2 mt-8 px-2'>
							{getMenu(pathname).map(item => (
								<MenuItem item={item} />
							))}
						</div>
					</AboutUser>
				</aside>
			</div>
		</div>
	)
}

export default Sidebar
