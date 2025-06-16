export const getSentimentColor = (sentiment: string) => {
	switch (sentiment) {
		case 'positive':
			return 'bg-green-500'
		case 'negative':
			return 'bg-red-500'
		default:
			return 'bg-gray-500'
	}
}
