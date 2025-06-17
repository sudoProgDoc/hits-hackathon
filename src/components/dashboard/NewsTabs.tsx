export const NewsTabs = ({
	text,
	activeTab,
	setActiveTab
}: {
	text: string
	activeTab: string
	setActiveTab: (text: string) => void
}) => {
	return (
		<>
			<button
				onClick={() => setActiveTab(text.toLowerCase())}
				className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
					activeTab.toLowerCase() === text.toLowerCase()
						? 'text-white border-white'
						: 'text-purple-200 border-transparent hover:text-white'
				}`}
			>
				{text}
			</button>
		</>
	)
}
