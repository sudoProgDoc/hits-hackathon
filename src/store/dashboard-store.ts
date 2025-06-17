import { create } from 'zustand'

import { INewsResponse } from '@/types/news.types'
import { ActionStore, StateStore } from '@/types/store.types'

const defaultForm = {}

export const useDashboardStore = create<StateStore & ActionStore>((set, get) => ({
	favorites: [],
	isLoading: false,
	isModalOpen: false,
	refreshed: false,
	form: defaultForm,

	toggleModal: () => {
		set(prev => ({ isModalOpen: !prev.isModalOpen }))
	},

	toggleRefresh: () => {
		set(prev => ({ refreshed: !prev.refreshed }))
	},

	setFavorites: (item: INewsResponse[]) => {
		set(() => ({ favorites: item }))
	},
	addFavorite: (item: INewsResponse) => {
		set(prev => {
			const updateFavorites = [...prev.favorites, item]
			localStorage.setItem('favorites', JSON.stringify(updateFavorites))
			return { favorites: updateFavorites }
		})
	},

	removeFavorite: (item: INewsResponse) => {
		set(prev => {
			const updateFavorites = prev.favorites.filter(favorite => favorite.title !== item.title)
			localStorage.setItem('favorites', JSON.stringify(updateFavorites))
			return { favorites: updateFavorites }
		})
	},
	toggleFavorite: (item: INewsResponse) => {
		set(prev => {
			const favorites = [...prev.favorites]
			const itemIndex = favorites.findIndex(favorite => favorite.title === item.title)
			if (itemIndex === -1) {
				localStorage.setItem('favorites', JSON.stringify([...favorites, item]))
				return { favorites: [...favorites, item] }
			} else {
				favorites.splice(itemIndex, 1)
				localStorage.setItem('favorites', JSON.stringify(favorites))
				return { favorites }
			}
		})
	},
	isFavorite: (item: INewsResponse) => {
		return get().favorites.some(favorite => favorite.title === item.title)
	}
}))
