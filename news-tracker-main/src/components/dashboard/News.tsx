'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { AddNews } from '@/components/dashboard/AddNews'
import { NewsItem } from '@/components/dashboard/NewsItem'
import { NewsSearch } from '@/components/dashboard/NewsSearch'
import { NewsTabs } from '@/components/dashboard/NewsTabs'
import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'

import { INewsResponse } from '@/types/news.types'

import { useNews } from '@/hooks/useNews'

import { subscribeUser } from '@/utils/subscribeUser'

import { mockNews } from '@/data/news'

export const News = () => {
	const queryClient = useQueryClient()

	const [activeTab, setActiveTab] = useState('feed')
	const [searchQuery, setSearchQuery] = useState<string>('')
	const { isLoading } = useNews(activeTab)
	const data: INewsResponse[] = mockNews
	const filteredData = data.filter(
		item =>
			item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
	)

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ['news'] })
	}, [activeTab, queryClient]) // <-- срабатывает каждый раз при изменении activeTab

	useEffect(() => {
		subscribeUser()
	}, [])

	return (
		<>
			<Heading title='News Aggregator' />
			<div className='flex w-full gap-2 mb-2'>
				<NewsSearch
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
				<AddNews />
			</div>
			<div className='flex gap-8 mb-8'>
				<NewsTabs
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					text='Feed'
				/>
				<NewsTabs
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					text='Daily'
				/>
			</div>
			{isLoading ? (
				<Loader />
			) : (
				<div className='flex flex-col gap-8'>
					{(searchQuery ? filteredData : data).map(item => (
						<NewsItem item={item} />
					))}
					{(searchQuery ? filteredData : data).length < 1 && (
						<>
							<p className='text-center'>Don't have a news</p>
						</>
					)}
				</div>
			)}
		</>
	)
}
