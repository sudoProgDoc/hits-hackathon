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
	postponeds: [],

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
			if (typeof window !== 'undefined') {
				localStorage.setItem('favorites', JSON.stringify(updateFavorites))
			}
			return { favorites: updateFavorites }
		})
	},

	removeFavorite: (item: INewsResponse) => {
		set(prev => {
			const updateFavorites = prev.favorites.filter(favorite => favorite.title !== item.title)
			if (typeof window !== 'undefined') {
				localStorage.setItem('favorites', JSON.stringify(updateFavorites))
			}
			return { favorites: updateFavorites }
		})
	},

	setPostponeds: (item: INewsResponse[]) => {
		set(() => ({ postponeds: item }))
	},

	toggleFavorite: (item: INewsResponse) => {
		set(prev => {
			const favorites = [...prev.favorites]
			const itemIndex = favorites.findIndex(favorite => favorite.title === item.title)
			if (itemIndex === -1) {
				if (typeof window !== 'undefined') {
					localStorage.setItem('favorites', JSON.stringify([...favorites, item]))
				}
				return { favorites: [...favorites, item] }
			} else {
				favorites.splice(itemIndex, 1)
				if (typeof window !== 'undefined') {
					localStorage.setItem('favorites', JSON.stringify(favorites))
				}
				return { favorites }
			}
		})
	},

	isFavorite: (item: INewsResponse) => {
		return get().favorites.some(favorite => favorite.title === item.title)
	},

	togglePostponed: (item: INewsResponse) => {
		set(prev => {
			const postponeds = [...prev.postponeds]
			const itemIndex = postponeds.findIndex(postponed => postponed.title === item.title)
			if (itemIndex === -1) {
				if (typeof window !== 'undefined') {
					localStorage.setItem('postponeds', JSON.stringify([...postponeds, item]))
				}
				return { postponeds: [...postponeds, item] }
			} else {
				postponeds.splice(itemIndex, 1)
				if (typeof window !== 'undefined') {
					localStorage.setItem('postponeds', JSON.stringify(postponeds))
				}
				return { postponeds }
			}
		})
	},

	isPostponed: (item: INewsResponse) => {
		return get().postponeds.some(postponed => postponed.title === item.title)
	}
}))
