import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export const handleChange = (
	e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >,
	setForm: (name: string, value: string | number) => void
) => {
	const { name, value, type } = e.target

	return setForm(name, type === 'number' ? +value : value)
}
