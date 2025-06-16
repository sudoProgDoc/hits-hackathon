'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'

import { IAuthForm } from '@/types/auth.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { authService } from '@/services/auth.service'
import Loader from '@/components/ui/Loader'
import { errorCatch } from '@/api/error'
import { InputWithIcon } from '@/components/ui/input'
import { Lock, User } from 'lucide-react'
import { Box } from '@/components/ui/box'
import { AuthText } from '@/components/auth/AuthText'

export function Auth() {
	const [form, setForm] = useState<IAuthForm>({
		password: '__GfDF_342',
		username: 'test',
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = event.target
		setForm((prevState) => ({ ...prevState, [name]: value }))
	}

	const [isLoginForm, setIsLoginForm] = useState(false)

	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),

		onSuccess(data) {
			if (data.role) push(DASHBOARD_PAGES.HOME)
			toast.success('Successfully login!')
		},
		onError(error) {
			const err = errorCatch(error)
			toast.error(err)
			console.log(error)
		},
	})

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		localStorage.setItem('username', form.username)
		push(DASHBOARD_PAGES.HOME)
		// mutate(form)
	}

	return (
		<div className="flex min-h-screen">
			<Box className="lg:w-2/5 ">
				<form onSubmit={onSubmit}>
					<div className="text-center w-3/4 mx-auto mb-4">
						<Heading title={isLoginForm ? 'Login' : 'Register'} />
						<p>
							{isLoginForm
								? 'Sign in to your account'
								: 'Create an account to use the news aggregator'}
						</p>
					</div>
					<div className="flex flex-col gap-4 mb-8">
						<InputWithIcon
							Icon={User}
							onChange={handleChange}
							value={form.username}
							name="username"
							placeholder="Username"
						/>

						<InputWithIcon
							Icon={Lock}
							onChange={handleChange}
							name="password"
							type="password"
							value={form.password}
							placeholder="Password"
						/>
					</div>

					{/* <div className="w-10/12 mx-auto flex justify-center gap-4 mb-8"> */}
					<Button onClick={() => setIsLoginForm(true)} className="w-full mb-8">
						{isPending ? <Loader /> : isLoginForm ? 'Login' : 'Register'}
					</Button>
					{/* </div> */}
					<AuthText isLoginForm={isLoginForm} setIsLoginForm={setIsLoginForm} />
				</form>
			</Box>
		</div>
	)
}
