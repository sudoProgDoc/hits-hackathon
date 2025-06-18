// import { handleLogout } from '@app/shared/api/SetCookies'
import { User } from 'lucide-react'
import { ReactNode } from 'react'

import { LogoutBtn } from '../auth/LogoutBtn'

export const AboutUser = ({
	children,
	fullName = 'Admin'
}: {
	children: ReactNode
	fullName?: string
}) => (
	<>
		<div className='flex items-center w-52 overflow-hidden gap-4'>
			<div className='size-12 flex items-center justify-center rounded-full border-1'>
				<User />
			</div>
			<span className=''>{fullName}</span>
		</div>
		{children}

		<div className='w-60 px-6'>
			<LogoutBtn />
		</div>
	</>
)
