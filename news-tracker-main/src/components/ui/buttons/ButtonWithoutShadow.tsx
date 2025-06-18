import cn from 'clsx'
import { ReactNode } from 'react'

interface IProps {
	className?: string
	value?: string | ReactNode
	[keyof: string]: unknown
}

export const ButtonWithoutShadow = ({ className, value, ...props }: IProps) => {
	return (
		<button
			className={cn(
				' px-8 py-4 transition-transform duration-150 ease-in  hover:scale-90 rounded-lg cursor-pointer',
				className
			)}
			{...props}
		>
			{value}
		</button>
	)
}
