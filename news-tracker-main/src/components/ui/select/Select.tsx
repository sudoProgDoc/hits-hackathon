import { ReactNode, SelectHTMLAttributes } from 'react'
import cn from 'clsx'
interface ISelect extends SelectHTMLAttributes<HTMLSelectElement> {
	children: ReactNode
	className?: string
}

export const Select = ({ children, className, ...props }: ISelect) => {
	return (
		<select
			className={cn(
				'shadow-[var(--shadow-border)] px-8 py-4 rounded-lg outline-none focus:shadow-[var(--shadow-focus)]',
				className
			)}
			{...props}
		>
			{children}
		</select>
	)
}
