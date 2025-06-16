import { newsService } from '@/services/news.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
export function useNews() {
	const { data, isFetching } = useQuery({
		queryKey: ['news'],
		queryFn: () => newsService.getData(),
		retry: false, //todo must delete or comment
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
		},
	})

	return { mutate }
}
