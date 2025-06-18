import { UseMutateFunction } from '@tanstack/react-query'

import { INewsResponse } from './news.types'

export type StateStore = {
	favorites: INewsResponse[]
	postponeds: INewsResponse[]
	isLoading: boolean
	isModalOpen: boolean
	refreshed: boolean
	form: any
	id?: string
}

export type ActionStore = {
	toggleModal: () => void
	toggleRefresh: () => void

	addFavorite: (item: INewsResponse) => void
	removeFavorite: (item: INewsResponse) => void
	toggleFavorite: (item: INewsResponse) => void
	setFavorites: (item: INewsResponse[]) => void
	isFavorite: (item: INewsResponse) => boolean

	setPostponeds: (item: INewsResponse[]) => void
	isPostponed: (item: INewsResponse) => boolean
	togglePostponed: (item: INewsResponse) => void
}
