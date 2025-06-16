import { useDashboardStore } from '@/store/dashboard-store'
import { CirclePlus } from 'lucide-react'
import Modal from '../ui/Modal'
import { Input } from '../ui/input'
import { Button } from '../ui/buttons'
import { useNewsCreate } from '@/hooks/useNews'
import { useState } from 'react'

export const AddNews = () => {
	const [url, setUrl] = useState('')

	const { mutate } = useNewsCreate()

	const toggleModal = useDashboardStore((state) => state.toggleModal)
	const isModalOpen = useDashboardStore((state) => state.isModalOpen)
	const handleClick = () => {
		toggleModal()
	}
	return (
		<>
			<button onClick={handleClick} className="size-12">
				<CirclePlus className="size-full" />
			</button>

			{isModalOpen && (
				<Modal isOpen={isModalOpen} onClose={toggleModal}>
					<div className="flex flex-col gap-4 justify-center">
						<h2 className="fontb-bold text-2xl text-center">Add your URL</h2>
						<Input
							onChange={(e) => setUrl(e.target.value)}
							placeholder="site URL"
						/>

						<Button
							disabled={!url}
							onClick={() => {
								mutate(url)
								toggleModal()
							}}
						>
							Add
						</Button>
					</div>
				</Modal>
			)}
		</>
	)
}
