import cn from 'clsx'
import { LucideIcon } from 'lucide-react'
import { InputHTMLAttributes } from 'react'

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	className?: string
	Icon: LucideIcon
}

export const InputWithIcon = ({ className, Icon, ...props }: IInput) => {
	return (
		<div className={cn(
			' bg-colors-primaryElement relative rounded-lg',
			className
		)}>
			<Icon className='absolute top-1/2 -translate-y-1/2 left-4 text-colors-text' />
			<input
			className='pl-12 pr-8 py-4 h-full w-full placeholder:text-colors-text bg-transparent rounded-lg outline-none focus:shadow-sm focus:shadow-colors-white'
			{...props}
		/>
		</div>
	)
}
