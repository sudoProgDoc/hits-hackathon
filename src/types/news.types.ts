export interface INewsResponse {
	id: string
	ticker: string
	title: string
	summary: string
	timestamp: string
	url: string
	sentiment: 'positive' | 'negative' | 'neutral'
}
