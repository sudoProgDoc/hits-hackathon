import { Dispatch, SetStateAction } from 'react'

export const AuthText = ({
	isLoginForm,
	setIsLoginForm,
}: {
	isLoginForm: boolean
	setIsLoginForm: Dispatch<SetStateAction<boolean>>
}) => {
	return (
		<div className="text-center">
			<span>{isLoginForm ? "Don't have " : 'Have '} an account? </span>
			<button
				type="button"
				onClick={() => setIsLoginForm((prev) => !prev)}
				className="font-bold"
			>
				{isLoginForm ? 'Sign up' : 'Log in'}
			</button>
		</div>
	)
}
