interface IHeading {
	title: string
}

export function Heading({ title }: IHeading) {
	return (
			<h1 className='text-3xl font-medium text-white'>{title}</h1>
	)
}
