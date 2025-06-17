import type { PropsWithChildren } from 'react'

import Sidebar from '../sidebar/Sidebar'
import { Box } from '../ui/box'

export default function DashboardLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<main className='h-full flex gap-2 px-4 py-12 md:px-0 md:py-2'>
			<Sidebar />
			<Box className='space-y-4 w-full md:h-full md:w-10/12'>{children}</Box>
		</main>
	)
}
