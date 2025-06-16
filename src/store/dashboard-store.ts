import { errorCatch } from '@/api/error'
import { ActionStore, StateStore } from '@/types/store.types'
import { toast } from 'sonner'
import { create } from 'zustand'

const defaultForm = {}

export const useDashboardStore = create<StateStore & ActionStore>(
	(set, get) => ({
		favorites: [],
		isLoading: false,
		isModalOpen: false,
		refreshed: false,
		form: defaultForm,

		createData: async (activeType, mutate) => {
			try {
				set({ isLoading: true })
				switch (activeType) {
					case 'manager':
						mutate(get().form)
						set({ form: defaultForm, isModalOpen: false })
						toast.success('Менеджер успешно создан')
						break
					
				}
			} catch (error) {
				const err = errorCatch(error)
				toast.error(err)
			} finally {
				set({ isLoading: false })
			}
		},

		updateData: async (type: string) => {
			try {
				set({ isLoading: true })
				switch (type) {
					case 'manager':
						set({ form: defaultForm, isModalOpen: false })
						toast.success('Менеджер успешно создан')
						break
					
				}
			} catch (error) {
				const err = errorCatch(error)
				toast.error(err)
			} finally {
				set({ isLoading: false })
			}
		},

		deleteData: async (type: string, id: string, mutate) => {
			try {
				set({ isLoading: true })
				switch (type) {
					case 'manager':
						break
					case 'hotel':
						set({ isLoading: true })
						mutate(id)
						toast.success('Отель успешно удален')
						break
				}
			} catch (error) {
				console.log('err', error)
				const err = errorCatch(error)
				toast.error(err)
			} finally {
				set({ isLoading: false })
			}
		},

		getData: async (type: string) => {
			try {
				set({ isLoading: true })
			} catch (error) {}
		},

		toggleModal: () => {
			set((prev) => ({ isModalOpen: !prev.isModalOpen }))
		},

		toggleRefresh: () => {
			set((prev) => ({ refreshed: !prev.refreshed }))
		},

		changeForm: (key: string, value: any) => {
			set((prev) => ({ form: { ...prev.form, [key]: value } }))
		},
		resetForm() {
			set({ form: defaultForm })
		},
	})
)
