import { Loader as LoaderIcon } from 'lucide-react'

const Loader = () => {
	return (
		<div className="flex justify-center items-center">
			<LoaderIcon className="animate-spin h-8 w-8 text-colors-text" />
		</div>
	)
}

export default Loader
