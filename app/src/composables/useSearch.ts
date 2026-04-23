import { ref, computed } from 'vue'
import type { SearchResult } from '@/types'
import type { Session } from '@/stores/session'
import { createSearchIndex } from '@/services/searchIndex'

export function useSearch() {
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isSearching = ref(false)

  const searchIndex = createSearchIndex()

  const hasResults = computed(() => searchResults.value.length > 0)
  const hasQuery = computed(() => searchQuery.value.trim().length > 0)

  function initSearch(sessions: Session[]) {
    searchIndex.buildIndex(sessions)
  }

  function performSearch(query: string) {
    searchQuery.value = query
    isSearching.value = true

    if (!query.trim()) {
      searchResults.value = []
      isSearching.value = false
      return
    }

    searchResults.value = searchIndex.search(query)
    isSearching.value = false
  }

  function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    hasResults,
    hasQuery,
    initSearch,
    performSearch,
    clearSearch
  }
}
