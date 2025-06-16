import cn from 'clsx'
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>
interface PropsButton {
	className?: string
	children: ReactNode
	[key: string]: unknown
}
export function Button({ children, className, ...rest }: PropsButton) {
	return (
		<button
			className={cn(
				'linear rounded-lg shadow shadow-colors-primaryShadow text-colors-white bg-colors-primaryElement py-2 px-7 text-base font-medium transition hover:opacity-75 active:bg-colors-primary/50',
				className
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
