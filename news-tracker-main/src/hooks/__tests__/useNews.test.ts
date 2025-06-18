// __tests__/useNews.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNews, useNewsCreate } from '@/hooks/useNews'
import { newsService } from '@/services/news.service'

jest.mock('js-cookie')
jest.mock('@/services/news.service')

describe('useNews', () => {
	const queryClient = new QueryClient()
	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return cached data from cookie', async () => {
		const mockData = JSON.stringify({ mock: 'news' })
		;(Cookies.get as jest.Mock).mockReturnValue(mockData)

		const { result } = renderHook(() => useNews('daily'), { wrapper })

		expect(result.current.data).toBe(mockData)
		expect(result.current.isLoading).toBe(false)
		expect(newsService.getData).not.toHaveBeenCalled()
	})

	it('should fetch data if no cookie', async () => {
		;(Cookies.get as jest.Mock).mockReturnValue(undefined)
		const apiData = { id: '1', title: 'Some News' }
		;(newsService.getData as jest.Mock).mockResolvedValue(apiData)

		const { result } = renderHook(() => useNews('daily'), { wrapper })

		await waitFor(() => expect(result.current.data).toEqual(apiData))
		expect(newsService.getData).toHaveBeenCalledWith('daily')
	})
})
