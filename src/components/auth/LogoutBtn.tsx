import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { ButtonWithoutShadow } from '../ui/buttons'

import { authService } from '@/services/auth.service'

export const LogoutBtn = () => {
	const router = useRouter()
	return (
		<>
			<ButtonWithoutShadow
				className='px-[0] py-[0]'
				onClick={() => {
					authService.logout()
					router.push('/')
				}}
				value={
					<div className='flex gap-4'>
						<LogOut />
						Logout
					</div>
				}
			/>
		</>
	)
}
