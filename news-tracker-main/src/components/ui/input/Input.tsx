import cn from 'clsx'
import { InputHTMLAttributes } from 'react'

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	className?: string
}

export const Input = ({ className, ...props }: IInput) => {
	return (
		<input
			className={cn(
				' bg-colors-primaryElement px-8 py-4 text-white rounded-lg outline-none focus:shadow-sm focus:shadow-colors-white',
				className
			)}
			{...props}
		/>
	)
}
