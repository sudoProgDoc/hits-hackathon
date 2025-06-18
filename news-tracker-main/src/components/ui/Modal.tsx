import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	// Закрытие по ESC
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [onClose])

	if (typeof window === 'undefined' || !isOpen) return null

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div
				className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-lg p-6 animate-fade-in"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Кнопка закрытия */}
				<button
					onClick={onClose}
					className="absolute top-0 right-2 text-colors-primary transition-transform ease-in hover:scale-90 text-3xl font-bold"
				>
					&times;
				</button>
				{children}
			</div>
		</div>,
		document.body
	)
}

export default Modal
