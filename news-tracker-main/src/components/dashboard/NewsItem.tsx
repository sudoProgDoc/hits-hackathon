'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, Heart, Inbox } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { INewsResponse } from '@/types/news.types'

import { useDashboardStore } from '@/store/dashboard-store'

import { getSentimentColor } from '@/utils/getSentimentColor'

import Loader from '../ui/Loader'
import Modal from '../ui/Modal'

interface INewsItem {
	item: INewsResponse
}

export const NewsItem = ({ item }: INewsItem) => {
	const [isDownloading, setDownloading] = useState(false)

	const color = getSentimentColor(item.sentiment)

	const setFavorite = useDashboardStore(state => state.setFavorites)
	const setPostponeds = useDashboardStore(state => state.setPostponeds)

	const toggleFavorite = useDashboardStore(state => state.toggleFavorite)
	const togglePostponed = useDashboardStore(state => state.togglePostponed)
	const isFavorite = useDashboardStore(state => state.isFavorite(item))
	const isPostponed = useDashboardStore(state => state.isPostponed(item))

	const newsRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const localFavorites = localStorage.getItem('favorites')
			if (localFavorites) setFavorite(JSON.parse(localFavorites))

			const localPostponeds = localStorage.getItem('postponeds')
			if (localPostponeds) setPostponeds(localPostponeds ? JSON.parse(localPostponeds) : [])
		}
	}, [])

	const handleDownload = async () => {
		if (!newsRef.current) return
		setDownloading(true)
		// Скрыть иконки
		const buttons = newsRef.current.querySelectorAll('.no-export')
		buttons.forEach((el: any) => (el.style.display = 'none'))

		const canvas = await html2canvas(newsRef.current)
		const imgData = canvas.toDataURL('image/png')
		const pdf = new jsPDF()

		const imgProps = pdf.getImageProperties(imgData)
		const pdfWidth = pdf.internal.pageSize.getWidth()
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
		pdf.save(`news-${item.id}.pdf`)
		// Восстановить иконки
		buttons.forEach((el: any) => (el.style.display = 'block'))
		setDownloading(false)
	}
	return (
		<>
			<Modal
				onClose={() => {}}
				isOpen={isDownloading}
			>
				<div className='p-4'>
					<p className='font-bold text-2xl text-center'>Wait for the news to convert</p>
					<Loader />
				</div>
			</Modal>
			<div
				ref={newsRef}
				key={item.id}
				className='bg-white/90 backdrop-blur-sm border-white/20 rounded-xl p-2'
			>
				<div className='flex items-start gap-4'>
					<div className='flex flex-col items-center gap-2'>
						<h2 className='font-mono font-bold'>{item.ticker}</h2>
						<div className={`w-3 h-3 rounded-full ${color}`} />
					</div>
					<div className='flex-1'>
						<a
							href={item.url}
							target='_blank'
							className='font-semibold text-gray-900 mb-2 leading-tight cursor-pointer'
						>
							{item.title}
						</a>
						<p className='text-gray-600 text-sm mb-2'>{item.summary}</p>
						<span className='text-xs text-gray-500'>{item.timestamp}</span>
					</div>
					<div className='no-export'>
						<button onClick={handleDownload}>
							<Download />
						</button>
						<button onClick={() => togglePostponed(item)}>
							<Inbox className={`${isPostponed ? 'text-gray-900' : ''}`} />
						</button>
						<button onClick={() => toggleFavorite(item)}>
							<Heart className={`${isFavorite ? 'text-red-500' : ''}`} />
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
