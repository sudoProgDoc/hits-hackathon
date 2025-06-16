'use client'
import { AddNews } from '@/components/dashboard/AddNews'
import { NewsItem } from '@/components/dashboard/NewsItem'
import { NewsSearch } from '@/components/dashboard/NewsSearch'
import { NewsTabs } from '@/components/dashboard/NewsTabs'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'
import { mockNews } from '@/data/news'
import { useNews } from '@/hooks/useNews'
import { authService } from '@/services/auth.service'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const News = () => {
	const [activeTab, setActiveTab] = useState('feed')
	const [searchQuery, setSearchQuery] = useState<string>('')
	const { isLoading } = useNews()
	const data = mockNews
	const filteredData = data.filter(
		(item) =>
			item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
	)
	const router = useRouter()

	return (
		<Box>
			<div className="news-text">
				<div className="flex justify-between gap-4 mb-4">
					<Heading title="News Aggregator" />
					<button
						onClick={() => {
							authService.logout()
							router.push('/')
						}}
					>
						<LogOut />
					</button>
				</div>
				<div className="flex w-full gap-2 mb-2">
					<NewsSearch
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
					<AddNews />
				</div>
				<div className="flex gap-8 mb-8">
					<NewsTabs
						setActiveTab={setActiveTab}
						activeTab={activeTab}
						text="Feed"
					/>
					<NewsTabs
						setActiveTab={setActiveTab}
						activeTab={activeTab}
						text="Daily Digest"
					/>
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<div className="flex flex-col gap-8">
						{(searchQuery ? filteredData : data).map((item) => (
							<NewsItem item={item} />
						))}
					</div>
				)}
			</div>
		</Box>
	)
}
