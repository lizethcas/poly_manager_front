import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

export function useSearch() {
  const searchTerm = ref('')

  const searchApi = async (term: string) => {
    if (!term) return []
    const { get, apiRoutes } = await import('~/services/routes.api')
    const response = await get(apiRoutes.search(term))
    console.log('Search API response:', response)
    return response
  }

  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchApi(searchTerm.value),
    enabled: computed(() => searchTerm.value.length > 2),
    staleTime: 300
  })

  const updateSearch = (term: string) => {
    searchTerm.value = term
  }

  return {
    searchTerm,
    searchResults,
    isLoading,
    error,
    updateSearch,
    refetch
  }
} 