import Cookies from 'js-cookie'

import { INewsResponse } from '@/types/news.types'

import { axiosWithAuth } from '../api/interceptors'

class NewsService {
	private BASE_URL = '/news'

	async getData(type?: string) {
		const response = await axiosWithAuth.get<INewsResponse>(
			`${this.BASE_URL}${type ? `/${type}` : ''}`
		)
		if (type === 'daily')
			Cookies.set('daily', JSON.stringify(response.data), {
				expires: 1
			})
		return response.data
	}

	async createNews(url: string) {
		const response = await axiosWithAuth.post(`${this.BASE_URL}`, { url })
		return response.data
	}
}

export const newsService = new NewsService()
