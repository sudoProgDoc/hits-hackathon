'use client'

import { useState } from 'react'

import { Button, ButtonWithoutShadow } from '@/components/ui/buttons'

import { axiosWithAuth } from '@/api/interceptors'

const defaultTickers = ['SBER', 'GAZP', 'YDEX', 'LKOH']
const defaultTags = ['фондовый рынок', 'Криптовалюта']

export default function SettingsPage() {
	const [tickers, setTickers] = useState<string[]>(defaultTickers)
	const [tags, setTags] = useState<string[]>(defaultTags)
	const [newTicker, setNewTicker] = useState('')
	const [newTag, setNewTag] = useState('')
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
	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.toUpperCase())) {
			setTags([...tags, newTag.toUpperCase()])
			setNewTag('')
		}
	}

	const removeTicker = (t: string) => {
		setTickers(tickers.filter(ticker => ticker !== t))
	}

	const removeTag = (t: string) => {
		setTickers(tags.filter(tag => tag !== t))
	}

	const toggleSource = (key: keyof typeof sources) => {
		setSources({ ...sources, [key]: !sources[key] })
	}

	const saveSettings = () => {
		const payload = {
			tickers,
			tags,
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
					<Button
						onClick={addTicker}
						// className='bg-blue-600 text-white px-4 py-1 rounded'
					>
						Добавить
					</Button>
				</div>
				<div className='flex flex-wrap gap-2'>
					{tickers.map(ticker => (
						<span
							key={ticker}
							className='bg-colors-primaryElement px-3 py-1 rounded-full flex items-center gap-1'
						>
							{ticker}
							<ButtonWithoutShadow
								onClick={() => removeTicker(ticker)}
								className='text-red-500 px-[0] py-[0]'
								value='×'
							/>
						</span>
					))}
				</div>
			</div>

			{/* Tags */}
			<div>
				<label className='block font-semibold mb-2'>Теги (ключевые слова)</label>
				<div className='flex gap-2 mb-2'>
					<input
						type='text'
						placeholder='Например: фондовый рынок'
						value={newTag}
						onChange={e => setNewTag(e.target.value)}
						className='border px-2 py-1 rounded w-full'
					/>
					<Button onClick={addTag}>Добавить</Button>
				</div>
				<div className='flex flex-wrap gap-2'>
					{tags.map(tag => (
						<span
							key={tag}
							className='bg-colors-primaryElement px-3 py-1 rounded-full flex items-center gap-1'
						>
							{tag}
							<ButtonWithoutShadow
								onClick={() => removeTag(tag)}
								className='text-red-500 px-[0] py-[0]'
								value='×'
							/>
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
			<div className='flex justify-center'>
				<Button
					onClick={saveSettings}
					// className='bg-green-600 text-white px-6 py-2 rounded '
				>
					Сохранить настройки
				</Button>
			</div>
		</>
	)
}
