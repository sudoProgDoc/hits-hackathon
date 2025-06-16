import { UseMutateFunction } from '@tanstack/react-query'
import { INewsResponse } from './news.types'

export type StateStore = {
	favorites: INewsResponse[]
	isLoading: boolean
	isModalOpen: boolean
	refreshed: boolean
	form: any
	id?: string
}

export type ActionStore = {
	getData: (type: string) => Promise<any>
	createData: (
		type: string,
		mutate: UseMutateFunction<any, Error, any, unknown>
	) => Promise<void>
	updateData: (type: string) => void
	deleteData: (
		type: string,
		id: string,
		mutate: UseMutateFunction<any, Error, string, unknown>
	) => void
	toggleModal: () => void
	toggleRefresh: () => void
	changeForm: (key: string, value: any) => void
	changeArrForm?: (key: string, value: any) => void
	resetForm?: () => void
	setId?: (id: string) => void
}

export interface ActionClientStore
	extends Omit<
		ActionStore,
		'updateData' | 'deleteData' | 'changeArrForm' | 'createData'
	> {
	getData: () => Promise<any>
	createData: (
		mutate: UseMutateFunction<any, Error, any, unknown>
	) => Promise<any>
}
