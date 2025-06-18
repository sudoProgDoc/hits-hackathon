import Cookies from 'js-cookie'

import { INewsResponse } from '@/types/news.types'

import { axiosWithAuth } from '../../api/interceptors'
import { newsService } from '../news.service'

// Моки
jest.mock('js-cookie', () => ({
	set: jest.fn()
}))
jest.mock('../../api/interceptors', () => ({
	axiosWithAuth: {
		get: jest.fn(),
		post: jest.fn()
	}
}))

describe('NewsService', () => {
	const mockData: INewsResponse = {
		id: '1',
		ticker: 'AAPL',
		title: 'Apple releases new product',
		summary: 'A summary of the news.',
		timestamp: '2 ago',
		url: '',
		sentiment: 'positive'
	}

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('getData', () => {
		it('should fetch news without type', async () => {
			;(axiosWithAuth.get as jest.Mock).mockResolvedValueOnce({ data: mockData })

			const result = await newsService.getData()

			expect(axiosWithAuth.get).toHaveBeenCalledWith('/news')
			expect(result).toEqual(mockData)
			expect(Cookies.set).not.toHaveBeenCalled()
		})

		it('should fetch daily news and set cookie', async () => {
			;(axiosWithAuth.get as jest.Mock).mockResolvedValueOnce({ data: mockData })

			const result = await newsService.getData('daily')

			expect(axiosWithAuth.get).toHaveBeenCalledWith('/news/daily')
			expect(Cookies.set).toHaveBeenCalledWith('daily', JSON.stringify(mockData), { expires: 1 })
			expect(result).toEqual(mockData)
		})
	})

	describe('createNews', () => {
		it('should post news url', async () => {
			const mockUrl = 'https://example.com/news'
			const responseData = { success: true }

			;(axiosWithAuth.post as jest.Mock).mockResolvedValueOnce({ data: responseData })

			const result = await newsService.createNews(mockUrl)

			expect(axiosWithAuth.post).toHaveBeenCalledWith('/news', { url: mockUrl })
			expect(result).toEqual(responseData)
		})
	})
})
