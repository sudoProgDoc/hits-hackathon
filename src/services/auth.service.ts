import { IAuthForm, IAuthResponse } from '../types/auth.types'

import { axiosClassic } from '../api/interceptors'

import { removeFromStorage, saveTokenStorage } from './auth-token.service'
import { toast } from 'sonner'
import { errorCatch } from '@/api/error'

export const authService = {
	async main(type: 'login' | 'register', data: IAuthForm) {
		try {
			const response = await axiosClassic.post<IAuthResponse>(
				`/auth/${type}`,
				data
			)
			if (response.data) saveTokenStorage(response.data?.accessToken)
			return response.data
		} catch (error) {
			throw new Error(errorCatch(error))
		}
	},

	async getNewTokens() {
		const response = await axiosClassic<IAuthResponse>('/auth/refresh')

		if (response.data.accessToken) {
			saveTokenStorage(response.data.accessToken)
		}

		return response
	},

	async logout() {
		// try {
		// 	const response = await axiosClassic.get('/auth/logout')

		// 	if (response?.status === 200) {
		// 		removeFromStorage()
		// 		toast.success('Выход из аккаунта')
		// 		return response
		// 	}
		// } catch (error) {
		// 	toast.error('Ошибка при выходе из аккаунта')
		// }
		localStorage.removeItem('username')
	},
}
