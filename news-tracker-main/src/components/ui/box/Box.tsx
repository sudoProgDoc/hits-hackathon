import cn from 'clsx'
import { ReactNode } from 'react'

export const Box = ({ children, className }: { children: ReactNode; className?: string }) => {
	return (
		<div
			className={cn(
				'bg-colors-primaryLight mx-auto shadow-xl shadow-colors-primaryShadow rounded-xl p-layout',
				className
			)}
		>
			{children}
		</div>
	)
}
