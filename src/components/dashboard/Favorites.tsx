'use client'

import { useState } from 'react'

import { NewsItem } from '@/components/dashboard/NewsItem'
import { NewsSearch } from '@/components/dashboard/NewsSearch'
import { Heading } from '@/components/ui/Heading'
import { Box } from '@/components/ui/box'

import { INewsResponse } from '@/types/news.types'

import { useDashboardStore } from '@/store/dashboard-store'

export const Favorites = () => {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const data: INewsResponse[] = useDashboardStore(state => state.favorites)
	console.log(data)

	const filteredData = data.filter(
		item =>
			item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<>
			<Heading title='Favorites News' />
			<div className='flex w-full gap-2 mb-2'>
				<NewsSearch
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
			</div>
			<div className='flex flex-col gap-8'>
				{(searchQuery ? filteredData : data).map(item => (
					<NewsItem item={item} />
				))}
				{(searchQuery ? filteredData : data).length < 1 && (
					<>
						<p className='text-center'>Don't have a favorites news</p>
					</>
				)}
			</div>
		</>
	)
}
