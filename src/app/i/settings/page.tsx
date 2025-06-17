'use client'

import { useState } from 'react'

import { axiosWithAuth } from '@/api/interceptors'

const defaultTickers = ['SBER', 'GAZP', 'YDEX', 'LKOH']

export default function SettingsPage() {
	const [tickers, setTickers] = useState<string[]>(defaultTickers)
	const [newTicker, setNewTicker] = useState('')
	const [sources, setSources] = useState({
		rbc: true,
		kommersant: true,
		telegram: true,
		custom: false
	})
	const [format, setFormat] = useState<'digest' | 'stream'>('digest')
	const [notifications, setNotifications] = useState<'daily' | 'none'>('daily')

	const addTicker = () => {
		if (newTicker.trim() && !tickers.includes(newTicker.toUpperCase())) {
			setTickers([...tickers, newTicker.toUpperCase()])
			setNewTicker('')
		}
	}

	const removeTicker = (t: string) => {
		setTickers(tickers.filter(ticker => ticker !== t))
	}

	const toggleSource = (key: keyof typeof sources) => {
		setSources({ ...sources, [key]: !sources[key] })
	}

	const saveSettings = () => {
		const payload = {
			tickers,
			sources,
			format,
			notifications
		}
		console.log('Saving settings:', payload)
		axiosWithAuth.post('/settings', payload)
	}

	return (
		<>
			<h1 className='text-2xl font-bold'>News aggregator settings</h1>

			{/* Tickers */}
			<div>
				<label className='block font-semibold mb-2'>Тикеры</label>
				<div className='flex gap-2 mb-2'>
					<input
						type='text'
						placeholder='Например: SBER'
						value={newTicker}
						onChange={e => setNewTicker(e.target.value)}
						className='border px-2 py-1 rounded w-full'
					/>
					<button
						onClick={addTicker}
						className='bg-blue-600 text-white px-4 py-1 rounded'
					>
						Добавить
					</button>
				</div>
				<div className='flex flex-wrap gap-2'>
					{tickers.map(ticker => (
						<span
							key={ticker}
							className='bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1'
						>
							{ticker}
							<button
								onClick={() => removeTicker(ticker)}
								className='text-red-500'
							>
								×
							</button>
						</span>
					))}
				</div>
			</div>

			{/* Sources */}
			<div>
				<label className='block font-semibold mb-2'>Источники новостей</label>
				{Object.entries(sources).map(([key, value]) => (
					<label
						key={key}
						className='flex items-center gap-2'
					>
						<input
							type='checkbox'
							checked={value}
							onChange={() => toggleSource(key as keyof typeof sources)}
						/>
						{key === 'rbc' && 'РБК'}
						{key === 'kommersant' && 'Коммерсант'}
						{key === 'telegram' && 'Telegram'}
						{key === 'custom' && 'Собственные источники'}
					</label>
				))}
			</div>

			{/* Format */}
			<div>
				<label className='block font-semibold mb-2'>Формат вывода</label>
				<select
					value={format}
					onChange={e => setFormat(e.target.value as 'digest' | 'stream')}
					className='border px-3 py-2 rounded w-full'
				>
					<option value='digest'>Утренний дайджест</option>
					<option value='stream'>Поточная лента</option>
				</select>
			</div>

			{/* Notifications */}
			<div>
				<label className='block font-semibold mb-2'>Уведомления</label>
				<select
					value={notifications}
					onChange={e => setNotifications(e.target.value as 'daily' | 'none')}
					className='border px-3 py-2 rounded w-full'
				>
					<option value='daily'>Оповещение утром</option>
					<option value='none'>Без уведомлений</option>
				</select>
			</div>
			<div className='mx-auto w-1/2'>
				<button
					onClick={saveSettings}
					className='bg-green-600 text-white px-6 py-2 rounded '
				>
					Сохранить настройки
				</button>
			</div>
		</>
	)
}
