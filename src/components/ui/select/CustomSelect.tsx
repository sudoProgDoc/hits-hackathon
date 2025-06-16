import {
	CSSProperties,
	FC,
	KeyboardEvent,
	useEffect,
	useRef,
	useState
} from 'react'

// Типы для опций
export type Option = { label: string; value: string }

// Тип для стилизованных частей селекта
export interface Styles {
	container?: CSSProperties
	control?: CSSProperties
	input?: CSSProperties
	menu?: CSSProperties
	option?: CSSProperties
}

// Пропсы компонента Select
export interface SelectProps {
	options: Option[] // Все доступные опции
	value?: Option | null // Текущее выбранное значение
	onChange: (option: Option) => void // Колбэк при выборе
	placeholder?: string // Плейсхолдер для поля ввода
	styles?: Styles // Кастомные стили
}

export const CustomSelect: FC<SelectProps> = ({
	options,
	value = null,
	onChange,
	placeholder = 'Select...',
	styles = {}
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [highlightedIndex, setHighlightedIndex] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)

	// Фильтрация опций по введенному тексту
	const filtered = options.filter(opt =>
		opt.label.toLowerCase().includes(query.toLowerCase())
	)

	// Закрытие меню при клике вне компонента
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
				setHighlightedIndex(0)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Клавиатурная навигация
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setHighlightedIndex(i => Math.min(i + 1, filtered.length - 1))
				break
			case 'ArrowUp':
				e.preventDefault()
				setHighlightedIndex(i => Math.max(i - 1, 0))
				break
			case 'Enter':
				e.preventDefault()
				const option = filtered[highlightedIndex]
				if (option) {
					onChange(option)
					setQuery(option.label)
					setIsOpen(false)
				}
				break
			case 'Escape':
				setIsOpen(false)
				break
		}
	}

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: 240,
				height: '100%',
				...styles.container
			}}
		>
			<div
				style={{
					display: 'flex',
					position: 'relative',
					height: '100%',
					...styles.control
				}}
				onClick={() => setIsOpen(open => !open)}
			>
				<input
					// type="text"
					// type="search"
					value={value !== null ? value?.label : query}
					name='custom-select-input'
					placeholder={placeholder}
					// autoComplete="off"
					onChange={e => {
						e.preventDefault()
						setQuery(e.target.value)
						setIsOpen(true)
						setHighlightedIndex(0)
					}}
					onKeyDown={handleKeyDown}
					className='px-8 py-4'
					style={{
						flex: 1,
						boxShadow: 'var(--shadow-border)',
						outline: 'none',
						borderRadius: '.5rem',
						width: '100%',
						...styles.input
					}}
				/>
				<div
					style={{
						alignSelf: 'center',
						padding: '0 8px',
						cursor: 'pointer',
						position: 'absolute',
						right: 0,
						rotate: isOpen ? '180deg' : '0deg'
					}}
				>
					{/* Стрелка вниз */}
					<svg
						width='20'
						height='20'
						viewBox='0 0 20 20'
					>
						<path
							d='M5 7l5 5 5-5H5z'
							fill='currentColor'
						/>
					</svg>
				</div>
			</div>

			{isOpen && (
				<ul
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						right: 0,
						width: '100%',
						maxHeight: 200,
						overflowY: 'auto',
						margin: 0,
						padding: 0,
						listStyle: 'none',
						border: '1px solid #ccc',
						background: '#fff',
						zIndex: 1000,
						...styles.menu
					}}
				>
					{filtered.length > 0 ? (
						filtered.map((opt, idx) => (
							<li
								key={opt.value}
								onMouseEnter={() => setHighlightedIndex(idx)}
								onClick={() => {
									onChange(opt)
									setQuery(opt.label)
									setIsOpen(false)
								}}
								style={{
									padding: 8,
									background: idx === highlightedIndex ? '#eee' : '#fff',
									cursor: 'pointer',
									...styles.option
								}}
							>
								{opt.label}
							</li>
						))
					) : (
						<li style={{ padding: 8, color: '#888' }}>No options</li>
					)}
				</ul>
			)}
		</div>
	)
}
