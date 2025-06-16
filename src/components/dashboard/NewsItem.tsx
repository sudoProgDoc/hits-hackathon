import { INewsResponse } from '@/types/news.types'
import { getSentimentColor } from '@/utils/getSentimentColor'

interface INewsItem {
	item: INewsResponse
}

export const NewsItem = ({ item }: INewsItem) => {
	const color = getSentimentColor(item.sentiment)
	return (
		<>
			<div
				key={item.id}
				className="bg-white/90 backdrop-blur-sm border-white/20 rounded-xl p-2"
			>
				<div className="flex items-start gap-4">
					<div className="flex flex-col items-center gap-2">
						<h2 className="font-mono font-bold">{item.ticker}</h2>
						<div className={`w-3 h-3 rounded-full ${color}`} />
					</div>
					<div className="flex-1">
						<a
							href={item.url}
							target="_blank"
							className="font-semibold text-gray-900 mb-2 leading-tight cursor-pointer"
						>
							{item.title}
						</a>
						<p className="text-gray-600 text-sm mb-2">{item.summary}</p>
						<span className="text-xs text-gray-500">{item.timestamp}</span>
					</div>
				</div>
			</div>
		</>
	)
}
