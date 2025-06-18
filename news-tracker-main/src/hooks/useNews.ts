import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

import { newsService } from '@/services/news.service'

export function useNews(type: string) {
	const { data, isFetching } = useQuery({
		queryKey: ['news'],
		queryFn: () => {
			const localDaily = Cookies.get('daily')
			if (localDaily) {
				return localDaily
			}
			newsService.getData(type)
		},
		retry: false //todo must delete or comment
	})

	return { data, isLoading: isFetching }
}

export function useNewsCreate() {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['clients'],
		mutationFn: (url: string) => newsService.createNews(url),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['news'] })
			toast.success('Successfully create!')
		}
	})

	return { mutate }
}
