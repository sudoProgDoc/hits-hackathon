import { INewsResponse } from '@/types/news.types'

import { axiosWithAuth } from '../api/interceptors'
import { TypeUserForm } from '../types/auth.types'

class NewsService {
	private BASE_URL = '/news'

	async getData(type?: string) {
		const response = await axiosWithAuth.get<INewsResponse>(
			`${this.BASE_URL}${type ? `/${type}` : ''}`
		)
		return response.data
	}

	async createNews(url: string) {
		const response = await axiosWithAuth.post(`${this.BASE_URL}`, { url })
		return response.data
	}
}

export const newsService = new NewsService()
