import { Search } from 'lucide-react'
import { InputWithIcon } from '../ui/input'
import { Dispatch, SetStateAction } from 'react'

export const NewsSearch = ({
	searchQuery,
	setSearchQuery,
}: {
	searchQuery: string
	setSearchQuery: Dispatch<SetStateAction<string>>
}) => {
	return (
		<>
			{/* <Search className="absolute left-3 top-3 h-5 w-5 text-purple-200" /> */}
			<InputWithIcon
				Icon={Search}
				type="text"
				placeholder="Search tickers..."
				className="w-full"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
		</>
	)
}
