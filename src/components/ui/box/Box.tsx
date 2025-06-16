import { ReactNode } from 'react'
import cn from 'clsx'
export const Box = ({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'bg-colors-primaryLight m-auto shadow-xl shadow-colors-primaryShadow rounded-xl p-layout',
				className
			)}
		>
			{children}
		</div>
	)
}
